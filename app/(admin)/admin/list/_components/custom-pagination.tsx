"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
  totalPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const CustomPagination = ({
  totalPage,
  currentPage,
  onPageChange,
}: CustomPaginationProps) => {
  if (totalPage === 0) return null;
  return (
    <Pagination>
      <PaginationContent key={`pagination-content`}>
        <PaginationItem key={`item-previous`}>
          <PaginationPrevious
            key={`previous`}
            onClick={() => onPageChange(currentPage - 1)}
          />
        </PaginationItem>
        {totalPage <= 3 &&
          [1, 2, 3].map((i, index) => {
            return (
              <PaginationItem key={`item-${i}-${index}`}>
                {" "}
                {/* 组合唯一标识符 */}
                <PaginationLink
                  key={`link-${i}-${index}`}
                  isActive={currentPage === i}
                  onClick={() => {
                    if (currentPage !== i) onPageChange(i);
                  }}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          })}
        {totalPage > 3 &&
          [-2, -1, 0, 1, 2].map((i, index) => {
            const step =
              currentPage === 1 ? i + 1 : currentPage === totalPage ? i - 1 : i;
            const page = currentPage + step;

            if (page < 1 || page > totalPage) return null;

            // 拆分为三个独立的条件分支
            if (i === -2) {
              return page > 2 ? (
                <PaginationItem key={`pre-ellipsis-${page}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null;
            }

            if (i === 2) {
              return page < totalPage - 1 ? (
                <PaginationItem key={`post-ellipsis-${page}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null;
            }

            return (
              <PaginationItem key={`page-${page}`}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => currentPage !== page && onPageChange(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
        <PaginationItem key={`item-next`}>
          <PaginationNext
            key={`next`}
            onClick={() => onPageChange(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
