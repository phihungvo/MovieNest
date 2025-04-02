import styles from './ProgressOverlay.module.scss';
import classNames from 'classnames/bind';
import { Flex, Progress } from 'antd';

const cx = classNames.bind(styles);

function ProgressOverlay({ popularity, size = 35}) {
    console.log('popularity vote_average: ', popularity);
    return (
        <>
            <div className={cx('progress-overlay')}>
                <Flex wrap gap="small">
                    <Progress
                        type="circle"
                        // percent={Math.min(Math.floor(popularity.vote_average), 100)}
                        percent={Math.min(Math.floor(popularity * 10), 100)}
                        size={size}
                        strokeColor="#21d07a"
                        trailColor="#1f4a29"
                    />
                </Flex>
            </div>
        </>
    );
}

export default ProgressOverlay;
