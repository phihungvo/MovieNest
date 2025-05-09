import React, { useEffect, useState } from 'react';
import styles from './CardInfoCircle.module.scss';
import classNames from 'classnames/bind';
import { getMovieImage } from '~/service/admin/uploadFile';

const cx = classNames.bind(styles);

function CardInfoCircle({ movieResult }) {
    const [imageUrls, setImageUrls] = useState({});

    const getDefaultAvatar = (actorId) => {
        if (!actorId) {
            return `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70) + 1}`;
        }
        const idStr = actorId.toString().slice(-5);
        const avatarId = (parseInt(idStr) % 70) + 1;
        return `https://i.pravatar.cc/300?img=${avatarId}`;
    };

    useEffect(() => {
        const loadImages = async () => {
            const imagePromises = movieResult.map(async (actor) => {
                let imagePath = actor.profilePath;

                if (!imagePath || imagePath === 'null' || imagePath === 'undefined') {
                    return {
                        id: actor.id || Math.random().toString(),
                        url: getDefaultAvatar(actor.id)
                    };
                }

                if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
                    return { id: actor.id, url: imagePath };
                }

                try {
                    const imgUrl = await getMovieImage(imagePath);
                    return { id: actor.id, url: imgUrl };
                } catch (error) {
                    console.error(`Error loading image for actor ${actor.id}:`, error);
                    return { id: actor.id, url: getDefaultAvatar(actor.id) };
                }
            });

            const loadedImages = await Promise.all(imagePromises);
            const newImageUrls = {};
            loadedImages.forEach((item) => {
                newImageUrls[item.id] = item.url;
            });
            setImageUrls(newImageUrls);
        };

        if (movieResult && movieResult.length > 0) {
            loadImages();
        }
    }, [movieResult]);

    return (
        <div className={cx('card-film')}>
            {movieResult.map((actor) => (
                <div key={actor.id || Math.random()} className={cx('actor-card')}>
                    <div className={cx('actor-image')}>
                        <img
                            alt={actor.name || 'Actor'}
                            src={imageUrls[actor.id] || getDefaultAvatar(actor.id)}
                            onError={(e) => {
                                e.target.src = getDefaultAvatar(actor.id);
                            }}
                        />
                    </div>
                    <div className={cx('actor-name')}>{actor.name || 'Unknown Actor'}</div>
                    <div className={cx('actor-character')}>{actor.character || 'Unknown Role'}</div>
                </div>
            ))}
        </div>
    );
}

export default CardInfoCircle;
