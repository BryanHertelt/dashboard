import React from 'react';
import { fireEvent, getByText, render, screen } from '@testing-library/react';
import ShallowRenderer from 'react-test-renderer/shallow';
import FoldedSideBar, { renderFoldedBulletPoints } from '@/lib/trackerlayout/sidebar/foldedsidebar';
import UnfoldedSidebar from '@/lib/trackerlayout/sidebar/unfoldedsidebar';
import '@testing-library/jest-dom';
import HeadBarContainer from '@/lib/trackerlayout/headbar';
import SidebarContainer from '@/lib/trackerlayout/sidebar/sidebar';

const mockSidebarData = [
  { id: 1, IconComponent: () => <div data-testid="icon-1" />, link: "dashboard", element: "Dashboard", position: "default" },
  { id: 2, IconComponent: () => <div data-testid="icon-2" />, link: "assetdistribution", element: "Asset-Distribution", position: "default" },
  { id: 3, IconComponent: () => <div data-testid="icon-3" />, link: "defi", element: "Defi", position: "default" },
  { id: 4, IconComponent: () => <div data-testid="icon-4" />, link: "transactions", element: "Transactions", position: "default" },
  { id: 5, IconComponent: () => <div data-testid="icon-5" />, link: "explorer", element: "Explorer", position: "default" },
  { id: 6, IconComponent: () => <div data-testid="icon-6" />, link: "nfts", element: "NFTs", position: "default" },
  { id: 7, IconComponent: () => <div data-testid="icon-7" />, link: "derivatives", element: "Derivatives", position: "default" },
  { id: 8, IconComponent: () => <div data-testid="icon-8" />, link: "snapshots", element: "Snapshots", position: "default" },
  { id: 9, IconComponent: () => <div data-testid="icon-9" />, link: "watchlist", element: "Watchlists", position: "default" },
  { id: 10, IconComponent: () => <div data-testid="icon-10" />, link: "reports", element: "Reports", position: "default" },
  { id: 11, IconComponent: () => <div data-testid="icon-11" />, link: "help", element: "Help", position: "default" },
  { id: 12, IconComponent: () => <div data-testid="icon-12" />, link: "settings", element: "Settings", position: "default" },
  { id: 13, IconComponent: () => <div data-testid="icon-13" />, link: "getsupport", element: "Get Support", position: "default" },
];



describe('FoldedSideBar Component', () => {
  it('matches snapshot', () => {
    const { container } = render(<FoldedSideBar sidebarnavResponse={mockSidebarData} />);
    expect(container).toMatchSnapshot();
  });
  it('renders critical elements', ()=> {
  render(<FoldedSideBar sidebarnavResponse={mockSidebarData} />)
  expect(screen.getByText('General')).toBeInTheDocument(); 
  expect(screen.getByText('Support')).toBeInTheDocument();
  })
  it('renderFoldedBulletPoints does not return null', () => {
    const { container } = render(<FoldedSideBar sidebarnavResponse={mockSidebarData} />)
    expect(container).not.toBeNull() 
  })
}); 

describe('UnfoldedSidebar Component', ()=> {
  it('matches snapshot', () => {
const { container } = render(<UnfoldedSidebar sidebarnavResponse={mockSidebarData}/>) 
expect(container).toMatchSnapshot(); 
  }) 
  it('renders criticial elements', ()=> {
   render(<UnfoldedSidebar sidebarnavResponse={mockSidebarData}/>) 
   expect(screen.getByText('General')).toBeInTheDocument(); 
   expect(screen.getByText('Support')).toBeInTheDocument();
  })

  it('rendersUnfoldedBulletPoints does not return null', ()=> {
    const {container} = render(<UnfoldedSidebar sidebarnavResponse={mockSidebarData}/>)
    expect(container).not.toBeNull() 
  }) 

  it('renders all sidebarelements', ()=> {
    render(<UnfoldedSidebar sidebarnavResponse={mockSidebarData}/>) 
    mockSidebarData.forEach((item)=> {
      expect(screen.getByText(item.element)).toBeInTheDocument(); 
    })
  })
})

describe('HeadbarContainer', () => { 
  it('renders correctly', () => { 
  const renderer = new ShallowRenderer(); 
  renderer.render(<HeadBarContainer />); 
  const result =renderer.getRenderOutput(); 
  
  expect(result.type).toBe('nav')
  }); 

  it('matches snapshots', ()=> {
  const renderer = new ShallowRenderer(); 
  renderer.render(<HeadBarContainer />); 
  const result = renderer.getRenderOutput(); 

  expect(result).toMatchSnapshot(); 
  })
  });

describe('SidebarContainer', ()=> {
  it('renders correctly', ()=> {
    const renderer = new ShallowRenderer(); 
    renderer.render(<SidebarContainer />); 
    const result = renderer.getRenderOutput(); 

    expect(result.type).toBe('div')
  })

  it('matches snapshot', ()=> {
    const renderer = new ShallowRenderer(); 
    renderer.render(<SidebarContainer />) 
    const result = renderer.getRenderOutput() 

    expect(result).toMatchSnapshot(); 
  })
})
