import { ExposeNfts } from "../src/utility/lib/helpers/nft-container";
import { NftDetailImageContainer } from "../src/utility/lib/helpers/image-container";
import { formatValue } from "../src/utility/lib/helpers/helper-functions";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'

jest.mock("../src/utility/lib/helpers/image-container", () => ({
    NftDetailImageContainer: jest.fn().mockImplementation(() => null)
    }))


    jest.mock("../src/utility/lib/helpers/helper-functions", () => ({
        formatValue: jest.fn((number)=> {
            if(isNaN(Number(number))){
              console.error("Type error in formatValue")
              return("")
            }
            const formattedValue = Number(number).toFixed(2)
          
            return formattedValue
          }),
        formatCurrency: jest.fn((number)=> {
            if(isNaN(Number(number))){
              console.error("Type error in formatCurrency")
              return("")
            }
          const formattedCurrency = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(Number(number)); 
          return formattedCurrency
          })
    })) 



describe("nft-container", () => {
    const mockNFTs = {
            "assetvalue": 7, "name": "Binance", 
            "holdingurl": "https://www.example.com/huobi.png", 
            "nftcount": 3, "nfts": [
                {"name": "Crazy Ape", "nfturl": "https://www.example.com/bayc.png",  "nftvalue": 15.5}, 
                {"name": "Ladybird", "nfturl": "https://www.example.com/cryptopunks.png","nftvalue": 20.3}, 
                {"name": "Crazy", "nfturl": "https://www.example.com/azuki.png", "nftvalue": 8.7}]
    }

    beforeEach(()=> {
        render(<ExposeNfts data={mockNFTs} />)
    })

    afterEach(()=> {
        jest.clearAllMocks()
    })

    it("does not change the UI unexpected", () => {
        const {container} = render(<ExposeNfts data={mockNFTs} />)
        expect(container).toMatchSnapshot()
    })

    it("renders relevant data", () => {
       expect(screen.getByText("Crazy Ape...")).toBeInTheDocument()
       expect(screen.getByText("Ladybird")).toBeInTheDocument()
       expect(screen.getByText("Crazy")).toBeInTheDocument()
    })
    it("calls NFTDetailImageContainer with the right props", () => {
      expect(NftDetailImageContainer).toHaveBeenCalledTimes(3)
      expect(NftDetailImageContainer.mock.calls).toEqual(
        [
          [
            {
              url: 'https://www.example.com/bayc.png',
              alt: 'Crazy Ape Image in Detail Component',
              placeholder: 'Pic'
            },
            {}
          ],
          [
            {
              url: 'https://www.example.com/cryptopunks.png',
              alt: 'Ladybird Image in Detail Component',
              placeholder: 'Pic'
            },
            {}
          ],
          [
            {
              url: 'https://www.example.com/azuki.png',
              alt: 'Crazy Image in Detail Component',
              placeholder: 'Pic'
            },
            {}
          ]
        ]
      )
    })
    it("renders relevant pricing information", () => {
      mockNFTs.nfts.map((nft)=> {
        expect(screen.getByText(`${formatValue(nft.nftvalue)} ETH`)).toBeInTheDocument()
      })

    })

})