import React, { useEffect, useState } from 'react';
import { Card, Flex, Progress } from 'antd';
import styles from './CardInfoCircle.module.scss';
import classNames from 'classnames/bind';
import { PlayCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ProgressOverlay from '../ProgressOverplay';
import { getMovieImage } from '~/service/admin/uploadFile';

const cx = classNames.bind(styles);

function CardInfoCircle({ movieResult }) {
    console.log('Movie result=====: ', movieResult)
    return (
        <div className={cx('card-film')}>
            {movieResult.map((movie) => (
                <Card
                    key={movie.id}
                    hoverable
                    style={
                            { width: 150, height: 200, marginLeft: 15 }
                    }
                    cover={
                        <img
                            alt={movie.name}
                            src={movie.profilePath}
                            style={{
                                width: '150px',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '50%'
                            }}
                        />
                    }
                ></Card>
            ))}
        </div>
    );
}

export default CardInfoCircle;
