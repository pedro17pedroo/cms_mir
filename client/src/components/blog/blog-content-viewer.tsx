interface BlogContentViewerProps {
  content: string;
  className?: string;
}

export default function BlogContentViewer({ content, className = "" }: BlogContentViewerProps) {
  return (
    <div 
      className={`prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none 
                  prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 
                  prose-strong:text-gray-900 prose-code:text-purple-600 prose-code:bg-purple-50 
                  prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-orange-500 
                  prose-blockquote:text-gray-600 prose-li:text-gray-700 prose-table:text-gray-700
                  prose-th:bg-gray-50 prose-th:text-gray-900 prose-td:border-gray-300
                  prose-th:border-gray-300 prose-img:rounded-lg prose-img:shadow-md ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}