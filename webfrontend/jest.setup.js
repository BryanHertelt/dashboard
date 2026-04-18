import fetchMock from 'jest-fetch-mock'
fetchMock.enableMocks()
jest.mock("next/image", () => ({
    __esModule: true,
    default: (props) => {
      return <img {...props} />;
    },
  }));