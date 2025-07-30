export const pagingSkipValue = (page, itemsPerPage) => {
  // Luôn đảm bảo giá trị không hợp lệ trả về 0 (kiểm tra cho cẩn thận thôi bên boardService đã gán giá trị mặc định rôi)
  if (!page || !itemsPerPage) return 0
  if (page <= 0 || itemsPerPage <= 0) return 0
  return (page - 1) * itemsPerPage
}