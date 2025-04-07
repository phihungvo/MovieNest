import { Avatar, List, Typography } from 'antd';

const data = [
  {
    author: 'Phi Hùng',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content: 'Đây là một comment mẫu sử dụng Ant Design.',
    datetime: 'Vài giây trước',
  },
];

const CommentList = () => (
  <List
    itemLayout="horizontal"
    dataSource={data}
    renderItem={(item) => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src={item.avatar} />}
          title={<Typography.Text strong>{item.author}</Typography.Text>}
          description={item.content}
        />
        <div>{item.datetime}</div>
      </List.Item>
    )}
  />
);

export default CommentList;
