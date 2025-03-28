import React from 'react';
import { Table as AntTable } from 'antd';
import classNames from 'classnames/bind';
import styles from './SmartTable.module.scss';

const cx = classNames.bind(styles);

function SmartTable({columns, dataSource, loading, pagination, onTableChange}) {

    return (
        <div className={cx('table-container')}>
            <AntTable
                bordered
                className={cx('customTable')}
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                rowKey="id"
                pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20'],
                }}
                onChange={onTableChange}
            />
        </div>
    );
}

export default SmartTable;
