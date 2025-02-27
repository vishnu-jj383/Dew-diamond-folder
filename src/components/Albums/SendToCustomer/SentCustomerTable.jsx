import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { Modal, Image } from "antd";

// Sample images for the carousel
const images = [
  "https://i.pinimg.com/736x/92/93/f2/9293f25b1f67d2636be610094c622cc7.jpg",
  "https://i.pinimg.com/736x/8a/24/23/8a2423d2afff178a98aaa31fcce8efa1.jpg",
  "https://i.pinimg.com/736x/51/b1/9a/51b19ad3567015e325413743b483fa8f.jpg",
];

const SentCustomerTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <tr>
        <td>
          <FaEye className="text-primary" />
        </td>
        <td>10 Feb 2025</td>
        <td>
          {/* Show only one image in the table */}
          <img
            src={images[0]}
            width={50}
            height={50}
            style={{ objectFit: "cover", cursor: "pointer" }}
            onClick={() => setIsModalOpen(true)} // Open modal on click
            alt="Preview"
          />
        </td>
        <td>2</td>
        <td>Bhima</td>
        <td>bhima@gmail.com</td>
        <td>
          <i className="fab fa-whatsapp" />
        </td>
        <td>
          <i className="fas fa-envelope" />
        </td>
      </tr>

      {/* Image Modal with Carousel */}
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        centered
      >
        <Image.PreviewGroup>
          {images.map((img, index) => (
            <Image key={index} src={img} width="100%" />
          ))}
        </Image.PreviewGroup>
      </Modal>
    </>
  );
};

export default SentCustomerTable;
