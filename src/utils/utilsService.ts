import { useLocalizationContext } from "@mui/x-date-pickers/internals";

const propertyExists = <X, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    Object.prototype.hasOwnProperty.call(obj, prop)
  );
};

const getTimezone = <TDate>(
  adapter: ReturnType<typeof useLocalizationContext>,
  value: TDate
) => {
  return value == null || !adapter.utils.isValid(value as unknown as Date)
    ? null
    : adapter.utils.getTimezone(value as unknown as Date);
};

const fileToBase64 = (file: File) => {
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      //FIXME: !!!!
      resolve(reader.result!);
    };
    reader.onerror = (error) => reject(error);
  });
};

const urlToBase64 = (url: string) => {
  return fetch(url, {
    headers: new Headers({
      Origin: "*",
    }),
  })
    .then((response) => response.blob())
    .then((blob: any) => fileToBase64(blob));
};

const base64toFile = (dataUrl: any, filename: string) => {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const blobToFile = (blob: Blob, fileName: string) => {
  const b = blob as any;
  b.lastModifiedDate = new Date();
  b.name = fileName;
  return blob as File;
};

const getTypeClass = (fileType: string) => {
  return fileType.substring(0, fileType.indexOf("/"));
};

const isWildcard = (fileType: string) => {
  return fileType.indexOf("*") !== -1;
};

const getFileExtension = (file: File) => {
  return "." + file.name.split(".").pop();
};

const isFileTypeValid = (
  file: File,
  acceptList: string,
  separator: string = ","
) => {
  let acceptableTypes = acceptList.split(separator).map((type) => type.trim());
  for (let type of acceptableTypes) {
    const checkTypeClass = getTypeClass(file.type) === getTypeClass(type);
    const checkExtension =
      file.type == type ||
      getFileExtension(file).toLowerCase() === type.toLowerCase();
    let acceptable = isWildcard(type) ? checkTypeClass : checkExtension;
    if (acceptable) {
      return true;
    }
  }
  return false;
};

const isFileSizeValid = (file: File, max: number, min: number = 0) => {
  const size = file.size;
  const supportMin = min ? size >= min : true;
  const supportMax = max ? size <= min : true;
  return supportMin && supportMax;
};

const isImage = (value: any) => {
  //FIXME: any

  if (!value) {
    return;
  }

  const isImageUrl = (url: string) => {
    return /\.(jpeg|jpg|gif|png)$/.exec(url) != null;
  };

  const isImageFile = (file: File) => {
    return file.type.split("/")[0] === "image" || /^image\//.test(file.type);
  };

  const isImageBase64 = (url: string) => {
    const ext = url.substring(url.indexOf("/") + 1, url.indexOf(";base64"));
    return ["png", "jpg", "jpeg", "gif", "tif", "tiff"].indexOf(ext) > -1;
  };

  let result = false;
  if (Array.isArray(value)) {
    if (!value.length) {
      return false;
    }
    if (value.every((item) => item instanceof File && isImageFile(item))) {
      result = true;
    }
    if (
      value.every(
        (item) =>
          typeof item == "string" && (isImageUrl(item) || isImageBase64(item))
      )
    ) {
      result = true;
    }
  } else if (value instanceof File && isImageFile(value)) {
    result = true;
  } else if (
    typeof value == "string" &&
    (isImageUrl(value) || isImageBase64(value))
  ) {
    result = true;
  } else if (value instanceof FileList) {
    for (let i = 0; i < value.length; i++) {
      //FIXME: !!!!
      if (isImageFile(value.item(i)!)) {
        result = true;
      } else {
        result = false;
        break;
      }
    }
  }
  return result;
};

const isValidURL = (url: string) => {
  const res = url.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res !== null;
};

const setInputDirection = (element: any, value: string, rtl: boolean) => {
  const rgx = /^[-!$%^&*()_+|~=`{}\[\]:\";'<>?,.\/]*[A-Za-z]/;
  const isAscii = rgx.test(value);
  const isRtl = rtl;
  if (isAscii) {
    if (value) {
      element.style.direction = "ltr";
      element.style.textAlign = "left";
    } else {
      element.style.direction = isRtl ? "rtl" : "ltr";
      element.style.textAlign = isRtl ? "right" : "left";
    }
  } else {
    if (value) {
      element.style.direction = "rtl";
      element.style.textAlign = "right";
    } else {
      element.style.direction = isRtl ? "rtl" : "ltr";
      element.style.textAlign = isRtl ? "right" : "left";
    }
  }
};

const formatWithCommas = (number: number | string) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const joinArraysWithoutDuplicates = (
  array1: any[],
  array2: any[],
  field: string
) => {
  const set1 = new Set(array1.map((x) => x[field]));
  return [...array1, ...array2.filter((x) => !set1.has(x[field]))];
};

export const utilsService = {
  propertyExists,
  getTimezone,
  fileToBase64,
  urlToBase64,
  base64toFile,
  blobToFile,
  getTypeClass,
  isWildcard,
  getFileExtension,
  isFileTypeValid,
  isFileSizeValid,
  isImage,
  isValidURL,
  setInputDirection,
  joinArraysWithoutDuplicates,
  formatWithCommas,
};
