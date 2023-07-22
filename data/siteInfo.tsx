import {
  HomeIcon,
  ShieldExclamationIcon,
  CubeTransparentIcon,
  CurrencyBangladeshiIcon,
  HandRaisedIcon,
  AdjustmentsVerticalIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  InboxIcon,
  InboxStackIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/solid";

interface ILinksII {
  title: string;
  path: string;
  icon: JSX.Element;
}

export const links: ILinksII[] = [
  {
    title: "Home",
    path: "/home",
    icon: <HomeIcon className="w-5 h-5" />,
  },
  {
    title: "Orgnanizations",
    path: "/organizations",
    icon: <HandRaisedIcon className="w-5 h-5" />,
  },
  {
    title: "Assesments",
    path: "/assesments",
    icon: <RectangleGroupIcon className="w-5 h-5" />,
  },
  // {
  //   title: "Regulators",
  //   path: "/regulators",
  //   icon: <Cog6ToothIcon className="w-5 h-5" />,
  // },

  // {
  //   title: "Logs",
  //   path: "/logs",
  //   icon: <DocumentTextIcon className="w-5 h-5" />,
  // },
  // {
  //   title: "Onboardings",
  //   path: "/onboardings",
  //   icon: <InboxIcon className="w-5 h-5" />,
  // },
];
