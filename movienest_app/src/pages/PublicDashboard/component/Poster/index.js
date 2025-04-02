import styles from './Poster.module.scss';
import classNames from "classnames/bind";
import 'tippy.js/dist/tippy.css';
import React, { useEffect, useState } from 'react';
import { Segmented, Card } from 'antd';
import CardInfo from '../CardInfo';

const cx = classNames.bind(styles)

function Poster({ title, options, fetchData, defaultValue = '', isTrailer = false }) {
    const [state, setState] = useState(defaultValue || (options.length > 0 ? options[0] : ''));
    const [results, setResults] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            try {
                const result = await fetchData(state);
                if (isMounted) setResults(result);

                console.log("Result useEffect((): ", result)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        loadData();
        return () => { isMounted = false; };
    }, [state, fetchData]);

    return (
        <div className={cx("wrapper")}>
            <div className={cx("inner")}>
                <div className={cx("header")}>
                    <h2>{title}</h2>
                    <Segmented value={state} onChange={setState} options={options} className={cx("segment")} />
                </div>
                <div className={cx("list-film")}>
                    <CardInfo isTrailer={isTrailer} state={state} movieResult={results} />
                </div>
            </div>
        </div>
    );
}

export default Poster;