interface sidebarelementinterface {
    id: number, 
    link: string, 
    element: string, 
    position: number | string
}

export const sidebarnavResponse: sidebarelementinterface[] = [
    {
        id: 1, 
        link: "dashboard",
        element: "Dashboard",
        position: "default"
    }, 
    {
        id: 2, 
        link: "assetdistribution",
        element: "Asset-Distribution" ,
        position: "default"
    }, 
    {
        id: 3, 
        link: "defi",
        element: "Defi",
        position: "default"
    }, 
    {
        id: 4, 
        link: "transactions",
        element: "Transactions",
        position: "default"
    }, 
    {
        id: 5, 
        link: "explorer",
        element: "Explorer",
        position: "default"
    }, 
    {
        id: 6, 
        link: "nfts",
        element: "NFTs",
        position: "default"
    }, 
    {
        id: 7, 
        link: "derivatives",
        element: "Derivatives",
        position: "default"
    }, 
    {
        id: 8, 
        link: "snapshots",
        element: "Snapshots",
        position: "default"
    }, 
    {
        id: 9, 
        link: "watchlist",
        element: "Watchlist",
        position: "default"
    }, 
    {
        id: 10, 
        link: "help",
        element: "Help",
        position: "default"
    }, 
    {
        id: 11, 
        link: "settings",
        element: "Settings",
        position: "default"
    }, 
    {
        id: 12, 
        link: "getsupport", 
        element: "Get Support",
        position: "default"
    }, 
    {
        id: 13, 
        link: "pricing", 
        element: "Try Premium",
        position: "default"
    }, 
]
