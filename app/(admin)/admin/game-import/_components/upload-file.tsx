"use client";

import { Trash2 } from "lucide-react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const getFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} bytes`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  } else {
    return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }
};

const UploadFile = ({ setData }: { setData: (data: any) => void }) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: File[] = [];
    acceptedFiles.forEach((file) => {
      newFiles.push(file);
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        const json = JSON.parse(binaryStr as string);
        //这里只传数组过去
        const data = json?.segments?.length ? json.segments[0].hits : [];
        console.log(data);
        setData(data);
      };
      reader.readAsText(file);
    });
    setFiles(newFiles);
  }, [setData]);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/json": [".json"] },
    multiple: false,
  });

  const deleteFile = () => {
    setFiles([]);
    setData([]);
  };

  return (
    <section className="w-full h-full flex flex-col gap-4">
      <div
        {...getRootProps({ className: "dropzone" })}
        className="flex-1 flex flex-col items-center justify-center bg-slate-500/30"
      >
        <input {...getInputProps()} />
        <p className="text-xs font-medium text-shadow-sm">
          *上传从GameDistribution上下载的json文件*
        </p>
      </div>
      {files.length > 0 && (
        <aside className="bg-sky-500/20">
          <ul>
            {files.map((file) => (
              <li
                key={file.name}
                className="flex items-center justify-between p-2 text-sm text-sky-700"
              >
                <span>
                  {file.name} - {getFileSize(file.size)}
                </span>
                <Trash2 className="w-4 h-4" onClick={deleteFile} />
              </li>
            ))}
          </ul>
        </aside>
      )}
    </section>
  );
};

export default UploadFile;
