import { createDrawerNavigator } from "@react-navigation/drawer";
import CalendarScreen from "./CalendarScreen";
import Home from "./Home";
import Profile from "./Profile";
import DrawerContent from "../components/DrawerContent";
import { Ionicons, FontAwesome, MaterialIcons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import HealthForm from "./HealthForm";
import MyMealPlans from "./MyMealPlans";
import MyGrocery from "./MyGrocery";
import UserSearch from "./UserSearch";
//import Feed from "./Feed";
import MyEventPlans from "./MyEventPlans";
import Classes from "./Classes";
import Scanner from "./Scanner";
import IngredientDetection from "./IngredientDetection";



const Drawer = createDrawerNavigator();
export default function DrawerNavigation() {
  return (<>
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Home} options={{
        headerTitle: "",
        drawerActiveBackgroundColor: "#e4efe4",
        drawerActiveTintColor: "#00BE00",
        drawerInactiveTintColor: "#1d1d1d",
        headerBackgroundContainerStyle: { display: "none" },
        drawerLabelStyle: {
          fontSize: 15,
        },
        headerTransparent: true,
        drawerIcon: ({ color }) => (
          <Ionicons name="home-outline" size={24} color={color} />
        ),
      }} />
      <Drawer.Screen name="Meal Planner" component={MyMealPlans} options={{
        headerTitle: "",
        drawerActiveBackgroundColor: "#e4efe4",
        drawerActiveTintColor: "#00BE00",
        drawerInactiveTintColor: "#1d1d1d",
        headerBackgroundContainerStyle: { display: "none" },
        drawerLabelStyle: {
          fontSize: 15,
        },
        headerTransparent: true,
        drawerIcon: ({ color }) => (
          <Ionicons name="calendar-outline" size={24} color={color} />
        ),
      }} />
      <Drawer.Screen name="My Profile" component={Profile} options={{
        headerTitle: "My Profile",
        drawerActiveBackgroundColor: "#e4efe4",
        drawerActiveTintColor: "#00BE00",
        drawerInactiveTintColor: "#1d1d1d",
        headerBackgroundContainerStyle: { display: "none" },
        drawerLabelStyle: {
          fontSize: 15,
        },
        headerTransparent: false,
        drawerIcon: ({ color }) => (
          <FontAwesome name="user-circle-o" size={24} color={color} />
        ),
      }} />
      <Drawer.Screen name="User Search" component={UserSearch} options={{
        headerTitle: "User Search",
        drawerActiveBackgroundColor: "#e4efe4",
        drawerActiveTintColor: "#00BE00",
        drawerInactiveTintColor: "#1d1d1d",
        headerBackgroundContainerStyle: { display: "none" },
        drawerLabelStyle: {
          fontSize: 15,
        },
        headerTransparent: false,
        drawerIcon: ({ color }) => (
          <FontAwesome name="search" size={24} color={color} />
        ),
      }} />
      {/* <Drawer.Screen name="Feed" component={Feed} options={{
        headerTitle: "Feed",
        drawerActiveBackgroundColor: "#e4efe4",
        drawerActiveTintColor: "#00BE00",
        drawerInactiveTintColor: "#1d1d1d",
        headerBackgroundContainerStyle: { display: "none" },
        drawerLabelStyle: {
          fontSize: 15,
        },
        headerTransparent: true,
        drawerIcon: ({ color }) => (
          <MaterialCommunityIcons name="post" size={24} color={color} />
        ),
      }} /> */}
      <Drawer.Screen name="Health Form" component={HealthForm} options={{
        headerTitle: "",
        drawerActiveBackgroundColor: "#e4efe4",
        drawerActiveTintColor: "#00BE00",
        drawerInactiveTintColor: "#1d1d1d",
        headerBackgroundContainerStyle: { display: "none" },
        drawerLabelStyle: {
          fontSize: 15,
        },
        headerTransparent: true,
        drawerIcon: ({ color }) => (
          <MaterialCommunityIcons name="hospital-box-outline" size={24} color={color} />
        ),
      }} />
      {<Drawer.Screen name="My Grocery List" component={MyGrocery} options={{
        headerTitle: "My Grocery List",
        drawerActiveBackgroundColor: "#e4efe4",
        drawerActiveTintColor: "#00BE00",
        drawerInactiveTintColor: "#1d1d1d",
        headerBackgroundContainerStyle: { display: "none" },
        drawerLabelStyle: {
          fontSize: 15,
        },
        headerTransparent: false,
        drawerIcon: ({ color }) => (
          <MaterialIcons name="local-grocery-store" size={24} color={color} />
        ),
      }} />
      }
      {<Drawer.Screen name="Event Planner" component={MyEventPlans} options={{
        headerTitle: "My Events",
        drawerActiveBackgroundColor: "#e4efe4",
        drawerActiveTintColor: "#00BE00",
        drawerInactiveTintColor: "#1d1d1d",
        headerBackgroundContainerStyle: { display: "none" },
        drawerLabelStyle: {
          fontSize: 15,
        },
        headerTransparent: false,
        drawerIcon: ({ color }) => (
          <Entypo name="cake" size={24} color={color} />
        ),
      }} />
      }
      {<Drawer.Screen name="Classes" component={Classes} options={{
        headerTitle: "Classes",
        drawerActiveBackgroundColor: "#e4efe4",
        drawerActiveTintColor: "#00BE00",
        drawerInactiveTintColor: "#1d1d1d",
        headerBackgroundContainerStyle: { display: "none" },
        drawerLabelStyle: {
          fontSize: 15,
        },
        headerTransparent: false,
        drawerIcon: ({ color }) => (
          <MaterialCommunityIcons name="google-classroom" size={24} color={color} />
        ),
      }} />
      }
      {<Drawer.Screen name="Scanner" component={Scanner} options={{
        headerTitle: "Scanner",
        drawerActiveBackgroundColor: "#e4efe4",
        drawerActiveTintColor: "#00BE00",
        drawerInactiveTintColor: "#1d1d1d",
        headerBackgroundContainerStyle: { display: "none" },
        drawerLabelStyle: {
          fontSize: 15,
        },
        headerTransparent: false,
        drawerIcon: ({ color }) => (
          <MaterialCommunityIcons name="food-halal" size={24} color={color} />
        ),
      }} />
      }
      {<Drawer.Screen name="IngredientDetection" component={IngredientDetection} options={{
        headerTitle: "Ingredient Detection",
        drawerActiveBackgroundColor: "#e4efe4",
        drawerActiveTintColor: "#00BE00",
        drawerInactiveTintColor: "#1d1d1d",
        headerBackgroundContainerStyle: { display: "none" },
        drawerLabelStyle: {
          fontSize: 15,
        },
        headerTransparent: false,
        drawerIcon: ({ color }) => (
          <MaterialCommunityIcons name="scan-helper" size={24} color={color} />
        ),
      }} />
      }
    </Drawer.Navigator>
  </>)

}