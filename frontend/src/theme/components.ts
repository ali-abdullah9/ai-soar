const components = {
  Button: {
    baseStyle: {
      fontWeight: 'bold',
      borderRadius: 'md',
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
        },
      },
      outline: {
        borderColor: 'brand.500',
        color: 'brand.500',
        _hover: {
          bg: 'brand.50',
        },
      },
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: 'bold',
      color: 'brand.800',
    },
    sizes: {
      lg: {
        fontSize: '2xl',
      },
      md: {
        fontSize: 'xl',
      },
      sm: {
        fontSize: 'lg',
      },
    },
  },
};

export default components;