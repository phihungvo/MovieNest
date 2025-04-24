const handleReply = async (commentId) => {
  if (!replyText[commentId]?.trim()) return;

  try {
      const replyData = {
          content: replyText[commentId],
          movieId: movieId,
          userId: userId
      };

      // Thay thế bằng API đúng cho reply
      await axios.post(
          `${API_ENDPOINTS.COMMENTS.BASE_URL}/${commentId}/reply`,
          replyData,
          {
              headers: {
                  Authorization: `Bearer ${getToken()}`,
                  'Content-Type': 'application/json',
              }
          }
      );

      setReplyText((prev) => ({
          ...prev,
          [commentId]: ''
      }));

      message.success('Phản hồi đã được gửi thành công');
      fetchComments(); // Tải lại bình luận
  } catch (error) {
      message.error('Không thể gửi phản hồi');
  }
};

export const replyToComment = async (parentId, data) => {
  const TOKEN = getToken();

  try {
      const response = await axios.post(
          `${API_ENDPOINTS.COMMENTS.BASE_URL}/${parentId}/reply`,
          {
              content: data.content,
              movieId: data.movieId,
              userId: data.userId,
          },
          {
              headers: {
                  Authorization: `Bearer ${TOKEN}`,
                  'Content-Type': 'application/json',
              },
          },
      );

      return response.data;
  } catch (error) {
      console.error(
          'Error creating reply:',
          error.response ? error.response.data : error,
      );
      throw error;
  }
};

// COMMENTS: {
//   BASE_URL: '/api/comment',
//   GET_ALL_COMMENT: '/api/comment/getAll',
//   CREATE: '/api/comment/create',
//   UPDATE: (id) => `/api/comment/${id}`,
//   UPDATE_PUT: (id) => `/api/comment/${id}`,
//   DELETE: (id) => `/api/comment/${id}`,
//   REACTION_TO_A_COMMENT: (id) => `/api/comment/${id}/reaction`,
//   REPLY_TO_COMMENT: (id) => `/api/comment/${id}/reply`
// },