"use client";

const Pagination = ({ currentPage, onPageChange }) => {
  return (
    <div>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Anterior
      </button>
      <span>Página {currentPage}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
