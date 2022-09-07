declare module 'fast-exif' {
  type ExifData = {
    exif: {
      DateTimeOriginal: string,
      LensModel: string,
      FocalLength: number,
      ISO: number,
      FNumber: number,
      ExposureTime: number,
      ExposureBiasValue: number,
    },
    gps: {
      GPSLatitudeRef: string,
      GPSLatitude: number[],
      GPSLongitudeRef: string,
      GPSLongitude: number[],
    },
    image: {
      Model: string
    }
  }
  function read(filename: string): Promise<ExifData>;
}
