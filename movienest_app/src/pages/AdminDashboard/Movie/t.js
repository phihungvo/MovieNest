// Trong component Movie
// Thay đổi khai báo của movieModalFields
const movieModalFields = [
  {
      label: 'Tiêu đề',
      name: 'title',
      type: 'text',
      rules: [{ required: true, message: 'Tiêu đề là trường bắt buộc!' }],
      placeholder: 'Nhập tiêu đề phim'
  },
  {
      label: 'Quốc gia',
      name: 'country',
      type: 'select',
      dataSourceKey: 'countries', // Sử dụng key để tham chiếu đến dataSources
      placeholder: 'Chọn quốc gia'
  },
  { 
      label: 'Điểm đánh giá trung bình', 
      name: 'voteAverage', 
      type: 'number',
      min: 0,
      max: 10,
      step: 0.1
  },
  { 
      label: 'Số lượt đánh giá', 
      name: 'voteCount', 
      type: 'number',
      min: 0 
  },
  { 
      label: 'Độ phổ biến', 
      name: 'popularity', 
      type: 'number',
      min: 0 
  },
  {
      label: 'Phổ biến',
      name: 'popular',
      type: 'yesno',
      options: ['Yes', 'No'],
  },
  {
      label: 'Phim người lớn',
      name: 'adult',
      type: 'yesno',
      options: ['Yes', 'No'],
  },
  {
      label: 'Đang chiếu rạp',
      name: 'inTheater',
      type: 'yesno',
      options: ['Yes', 'No'],
  },
  {
      label: 'Thể loại',
      name: 'genres',
      type: 'select',
      multiple: true,
      dataSourceKey: 'genres', // Sử dụng key để tham chiếu đến dataSources
      labelKey: 'name',  // Chỉ định trường để hiển thị làm label
      valueKey: 'id',    // Chỉ định trường để sử dụng làm value
      placeholder: 'Chọn thể loại phim',
      showSearch: true
  },
  {
      label: 'Trailers',
      name: 'trailers',
      type: 'select',
      multiple: true,
      dataSourceKey: 'trailers', // Sử dụng key để tham chiếu đến dataSources
      labelKey: 'title',  // Chỉ định trường để hiển thị làm label
      valueKey: 'id',     // Chỉ định trường để sử dụng làm value
      placeholder: 'Chọn trailer',
      showSearch: true
  },
  { 
      label: 'Mô tả', 
      name: 'overview', 
      type: 'textarea',
      fullWidth: true,
      rows: 4,
      placeholder: 'Nhập mô tả phim'
  },
  { 
      label: 'Poster', 
      name: 'posterPath', 
      type: 'upload',
      accept: 'image/*',
      listType: 'picture-card',
      maxCount: 1
  },
  { 
      label: 'Backdrop', 
      name: 'backdropPath', 
      type: 'upload',
      accept: 'image/*',
      listType: 'picture-card',
      maxCount: 1 
  },
  {
      label: 'Ngày phát hành',
      name: 'releaseDate',
      type: 'date',
      rules: [{ required: true, message: 'Ngày phát hành là trường bắt buộc!' }],
      format: 'DD/MM/YYYY'
  },
];

// Chuẩn bị dataSources dưới dạng object để truyền vào PopupModal
const prepareDataSources = () => {
  return {
      countries: countryList.map(country => ({ label: country, value: country })),
      genres: genresSources,
      trailers: trailerSources
  };
};

// Sử dụng PopupModal với dataSources dạng object
<PopupModal
  isModalOpen={isModalOpen}
  setIsModalOpen={setIsModalOpen}
  title={getModalTitle()}
  fields={modalMode === 'delete' ? [] : movieModalFields}
  dataSources={prepareDataSources()}
  onSubmit={handleFormSubmit}
  initialValues={selectedMovie}
  isDeleteMode={modalMode === 'delete'}
  formInstance={form}
  onBeforeSubmit={processFormData}
  cancelLabel="Hủy"
  submitLabel="Xác nhận"
  deleteConfirmLabel="Xóa"
/>