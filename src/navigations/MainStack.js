import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Sidebar from "../screens/Sidebar";
import Timeline from "../screens/Timeline";
import Notifications from "../screens/Notifications";
import Profile from "../screens/Profile";
import Recieve from "../screens/Recieve";
import Exchange from "../screens/Exchange";
import Transition from "../screens/Transition";
import PlaceOrder from "../screens/PlaceOrder";
import New from "../screens/New";
import AddItem from "../screens/AddItem";
import SelectScan from "../screens/SelectScan";
import ScanItem from "../screens/ScanItem";
import Confirm from "../screens/Confirm";
import Search from "../screens//Search";
import SelectNewCategory from "../screens/SelectNewCategory";
import SelectCategoryNo from "../screens/SelectCategoryNo";
import SearchedPosts from "../screens/SearchedPosts";
import SelectSite from "../screens/SelectSite";
import ItemsAnalysis from "../screens/ItemsAnalysis";
import ItemsConsumptions from "../screens/ItemsConsumptions";
import ItemsNew from "../screens/ItemsNew";
import ItemsPending from "../screens/ItemsPending";
import ItemsTransitions from "../screens/ItemsTransitions";
import SelectExchangeCategory from "../screens/SelectExchangeCategory";
import AddWorkShop from "../screens/AddWorkshop";
import Workshop from "../screens/Workshop";
import Cart from "../screens/Cart";

const Stack = createNativeStackNavigator();

export const MainStack = ({ socket, hasPermission, usersData }) => {
  return (
    <Stack.Navigator
      initialRouteName={!usersData?.roles?.StockRes ? `Timeline` : `SelectSIte`}
    >
      <Stack.Screen name="SelectSIte" options={{ headerShown: false }}>
        {(props) => <SelectSite {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen name="Timeline" options={{ headerShown: false }}>
        {(props) => <Timeline {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen name="Profile" options={{ headerShown: false }}>
        {(props) => <Profile {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen name="Confirm" options={{ headerShown: false }}>
        {(props) => <Confirm {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen name="Sidebar" options={{ headerShown: false }}>
        {(props) => <Sidebar {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen name="Notifications" options={{ headerShown: false }}>
        {(props) => <Notifications {...props} socket={socket} />}
      </Stack.Screen>

      <Stack.Screen name="New" options={{ headerShown: false }}>
        {(props) => (
          <New {...props} socket={socket} hasPermission={hasPermission} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Recieve" options={{ headerShown: false }}>
        {(props) => (
          <Recieve {...props} socket={socket} hasPermission={hasPermission} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Exchange" options={{ headerShown: false }}>
        {(props) => (
          <Exchange {...props} socket={socket} hasPermission={hasPermission} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Transition" options={{ headerShown: false }}>
        {(props) => (
          <Transition
            {...props}
            socket={socket}
            hasPermission={hasPermission}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="PlaceOrder" options={{ headerShown: false }}>
        {(props) => <PlaceOrder {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen name="AddItem" options={{ headerShown: false }}>
        {(props) => <AddItem {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen name="SelectScan" options={{ headerShown: false }}>
        {(props) => <SelectScan {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen name="ScanItem" options={{ headerShown: false }}>
        {(props) => (
          <ScanItem {...props} socket={socket} hasPermission={hasPermission} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Search" options={{ headerShown: false }}>
        {(props) => <Search {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen name="SelectNewCategory" options={{ headerShown: false }}>
        {(props) => <SelectNewCategory {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen name="SelectCategoryNo" options={{ headerShown: false }}>
        {(props) => <SelectCategoryNo {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen name="SearchedPosts" options={{ headerShown: false }}>
        {(props) => <SearchedPosts {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen name="ItemsAnalysis" options={{ headerShown: false }}>
        {(props) => <ItemsAnalysis {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen name="ItemsConsumptions" options={{ headerShown: false }}>
        {(props) => <ItemsConsumptions {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen name="ItemsNew" options={{ headerShown: false }}>
        {(props) => <ItemsNew {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen name="ItemsPending" options={{ headerShown: false }}>
        {(props) => <ItemsPending {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen name="ItemsTransitions" options={{ headerShown: false }}>
        {(props) => <ItemsTransitions {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen
        name="SelectExchangeCategory"
        options={{ headerShown: false }}
      >
        {(props) => <SelectExchangeCategory {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen name="AddWorkshop" options={{ headerShown: false }}>
        {(props) => <AddWorkShop {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen name="Workshop" options={{ headerShown: false }}>
        {(props) => <Workshop {...props} socket={socket} />}
      </Stack.Screen>
      <Stack.Screen name="Cart" options={{ headerShown: false }}>
        {(props) => <Cart {...props} socket={socket} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
