import React from 'react';
import { motion } from 'framer-motion';

interface FeatureDescriptionProps {
  content: string; 
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const FeatureDescription: React.FC<FeatureDescriptionProps> = ({ content }) => {
  return (
    <div className="serverce-cart-hot custom-padding w-full sm:w-11/12 md:w-10/12 lg:w-6/7 xl:w-5/6 max-w-5xl">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="feature-description-content text-white font-bold overflow-auto max-h-20 p-1 text-left"
      >
        {content.split(' ').map((word, index) => (
          <motion.span
            key={index}
            variants={item}
            className="word-span"
          >
            {word}{' '}
          </motion.span>
        ))}
      </motion.div>
      <style jsx>{`
        .custom-padding {
          padding: 10px !important;
          margin-left: 60px;
        }
        @media screen and (max-width: 768px) {
          .custom-padding {
            padding: 10px !important;
            margin-left: 0px;
            margin-top: 90px;
          }
        }
      `}</style>
    </div>
  );
};

export default FeatureDescription;
