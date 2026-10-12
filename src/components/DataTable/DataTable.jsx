import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Search, FileAudio, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

const DataTable = ({ transcriptData = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    return transcriptData.filter(({ filename = "" }) =>
      filename.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transcriptData, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRows = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (isoString) => {
    if (!isoString) return "—";
    try {
      return new Date(isoString).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--color-muted)" }}
          />
          <input
            type="text"
            placeholder="Search files by name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border outline-none transition-all"
            style={{
              background: "var(--color-pill)",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          />
        </div>

        {/* Rows per page selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs" style={{ color: "var(--color-muted)" }}>
          <span>Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg border text-xs outline-none"
            style={{
              background: "var(--color-pill)",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            <option value={5}>5 files</option>
            <option value={10}>10 files</option>
            <option value={25}>25 files</option>
            <option value={50}>50 files</option>
          </select>
        </div>
      </div>

      {/* Modern Table */}
      <div
        className="w-full overflow-x-auto rounded-xl border"
        style={{ borderColor: "var(--color-border)" }}
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className="border-b text-[11px] font-semibold uppercase tracking-wider"
              style={{
                background: "var(--color-pill)",
                borderColor: "var(--color-border)",
                color: "var(--color-muted)",
              }}
            >
              <th className="px-4 py-3">File Name</th>
              <th className="px-4 py-3 hidden sm:table-cell">Uploaded</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y text-xs" style={{ borderColor: "var(--color-border)" }}>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center" style={{ color: "var(--color-muted)" }}>
                  No files found matching your search.
                </td>
              </tr>
            ) : (
              paginatedRows.map((file) => (
                <tr
                  key={file.id}
                  className="transition-colors hover:bg-[var(--color-pill)] group"
                >
                  {/* File Name */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{
                          background: "var(--color-surface)",
                          borderColor: "var(--color-border)",
                          color: "var(--color-accent)",
                        }}
                      >
                        <FileAudio size={16} />
                      </div>
                      <div className="flex flex-col truncate max-w-[240px] sm:max-w-md">
                        <span className="font-semibold truncate" style={{ color: "var(--color-text)" }}>
                          {file.filename || "Untitled Recording"}
                        </span>
                        {file.transcription && (
                          <span className="text-[11px] truncate opacity-70" style={{ color: "var(--color-muted)" }}>
                            {file.transcription.slice(0, 60)}...
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Upload Date */}
                  <td className="px-4 py-3.5 hidden sm:table-cell" style={{ color: "var(--color-muted)" }}>
                    {formatDate(file.uploaded)}
                  </td>

                  {/* Action Link */}
                  <td className="px-4 py-3.5 text-right">
                    <NavLink
                      to={`/files/edit/${file.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-85 no-underline"
                      style={{
                        borderColor: "var(--color-border)",
                        background: "var(--color-surface)",
                        color: "var(--color-accent)",
                      }}
                    >
                      <span>Open</span>
                      <ExternalLink size={12} />
                    </NavLink>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs pt-2" style={{ color: "var(--color-muted)" }}>
        <span>
          Showing {filteredData.length > 0 ? startIndex + 1 : 0} to{" "}
          {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg border transition-opacity disabled:opacity-30"
            style={{
              borderColor: "var(--color-border)",
              background: "var(--color-surface)",
            }}
            title="Previous page"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="px-2 font-mono font-medium">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg border transition-opacity disabled:opacity-30"
            style={{
              borderColor: "var(--color-border)",
              background: "var(--color-surface)",
            }}
            title="Next page"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
