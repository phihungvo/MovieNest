import React from 'react';
import { Table as AntTable } from 'antd';
import classNames from 'classnames/bind';
import styles from './SmartTable.module.scss';
import { createStyles } from 'antd-style';
const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

const cx = classNames.bind(styles);

function SmartTable({columns, dataSources, loading, pagination, onTableChange}) {
    const { styles } = useStyle();

    return (
        <div className={cx('table-container')}>
            <AntTable
                bordered
                // className={cx('customTable')}
                className={styles.customTable}
                columns={columns}
                dataSource={dataSources}
                loading={loading}
                rowKey="id"
                pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20'],
                }}
                onChange={onTableChange}
                scroll={{ x: 'max-content'}}
            />
        </div>
    );
}

export default SmartTable;
