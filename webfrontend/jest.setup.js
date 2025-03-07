require('jest-fetch-mock').enableMocks(); 
jest.mock("next/image", () => ({
    __esModule: true,
    default: (props) => {
      return <img {...props} />;
    },
  }));