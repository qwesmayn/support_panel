import { existsSync, mkdirSync } from 'fs';
import multer from 'multer';
import { getFilePath } from './file.js';

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const { ticketId } = req.body;
      const dirPath = getFilePath(ticketId);

      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }
      cb(null, dirPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }),
});

export default upload;
