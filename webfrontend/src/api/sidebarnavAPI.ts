import { 
DashboardIcon,
AssetDistributionIcon,
DefiIcon,
TransactionIcon,
ExplorerIcon,
NftsIcon,
DerivativesIcon,
SnapshotIcon,
WatchListIcon,
ReportsIcon,
HelpIcon,
SettingsIcon,
SupportIcon
} from "../../public/images/index"




interface sidebarelementinterface {
    id: number, 
    IconComponent: React.ComponentType, 
    link: string, 
    element: string, 
    position: number | string
}

export const sidebarnavResponse: sidebarelementinterface[] = [
    {
        id: 1, 
        IconComponent: DashboardIcon,
        link: "dashboard",
        element: "Dashboard",
        position: "default"
    }, 
    {
        id: 2, 
        IconComponent: AssetDistributionIcon,
        link: "assetdistribution",
        element: "Asset-Distribution" ,
        position: "default"
    }, 
    {
        id: 3, 
        IconComponent: DefiIcon, 
        link: "defi",
        element: "Defi",
        position: "default"
    }, 
    {
        id: 4, 
        IconComponent: TransactionIcon, 
        link: "transactions",
        element: "Transactions",
        position: "default"
    }, 
    {
        id: 5, 
        IconComponent:ExplorerIcon,
        link: "explorer",
        element: "Explorer",
        position: "default"
    }, 
    {
        id: 6, 
        IconComponent: NftsIcon,
        link: "nfts",
        element: "NFTs",
        position: "default"
    }, 
    {
        id: 7, 
        IconComponent: DerivativesIcon,
        link: "derivatives",
        element: "Derivatives",
        position: "default"
    }, 
    {
        id: 8, 
        IconComponent: SnapshotIcon,
        link: "snapshots",
        element: "Snapshots",
        position: "default"
    }, 
    {
        id: 9, 
        IconComponent: WatchListIcon,
        link: "watchlist",
        element: "Watchlist",
        position: "default"
    }, 
    {
        id: 10, 
        IconComponent: ReportsIcon,
        link: "reports",
        element: "Watchlist",
        position: "default"
    }, 
    {
        id: 11, 
        IconComponent:HelpIcon,
        link: "help",
        element: "Help",
        position: "default"
    }, 
    {
        id: 12, 
        IconComponent: SettingsIcon,
        link: "settings",
        element: "Settings",
        position: "default"
    }, 
    {
        id: 13, 
        IconComponent: SupportIcon,
        link: "getsupport", 
        element: "Get Support",
        position: "default"
    }
]
