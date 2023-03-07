const path = require("path");
const cloudinary = require("cloudinary").v2;
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const fs = require("fs");

const uploadProductImageLocal = async (req, res) => {
  const productImage = req.files.image;
  //console.log(req.files);

  // check if file exists
  if (!productImage) {
    throw new CustomError.BadRequestError("Provide product image to upload.");
  }
  // check format
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please Upload Image");
  }
  // check size
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      "Image size must be smaller than 1MB."
    );
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  console.log(imagePath);

  await productImage.mv(imagePath);

  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `uploads/${productImage.name}` } });
};

const uploadProductImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "file-upload",
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath); // remove temporary files (tmp folder) but still sending the files to cloudinary
  return res.status(StatusCodes.OK).json({ img: { src: result.secure_url } });
};

module.exports = { uploadProductImage };
