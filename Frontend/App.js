//import { StatusBar } from 'expo-status-bar';
import "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import ForgotPassword from "./screens/ForgotPassword";
import Profile from "./screens/Profile";
import Scanner from "./screens/Scanner";
import MealPlanner from "./screens/MealPlanner";
import CalendarScreen from "./screens/CalendarScreen";
import CreateMealPlan from "./screens/CreateMealPlan";
import SearchRecipe from "./screens/SearchRecipe";
import DrawerNavigation from "./screens/DrawerNavigation";
import HealthForm from "./screens/HealthForm";
import AddMeal from "./screens/AddMeal";
import MyMealPlans from "./screens/MyMealPlans";
import MealDetail from "./screens/MealDetail";
import GroceryList from "./screens/GroceryList";
import MyGrocery from "./screens/MyGrocery";
import EditProfile from "./screens/EditProfile";
import Add from "./screens/Add";
import Save from "./screens/Save";
import Fetch from "./screens/Fetch";
import OtherUserProfile from "./screens/OtherUserProfile";
import PostDetail from "./screens/PostDetail";
import EditPost from "./screens/EditPost";
import Playlist from "./screens/Playlist";
import Reels from "./screens/Reels";
import SavePlaylist from "./screens/SavePlaylist";
import OtherPlaylist from "./screens/OtherPlaylist";
import PlaylistDetail from "./screens/PlaylistDetail";
import EditVideo from "./screens/EditVideo";
import Meeting from "./screens/Meeting";
import MeetingDetail from "./screens/MeetingDetail";
import MyEventPlans from "./screens/MyEventPlans";
import EventCalendar from "./screens/EventCalendar";
import AddRecipeForEvent from "./screens/AddRecipeForEvent";
import EventSearch from "./screens/EventSearch";
import EventDetails from "./screens/EventDetails";
import Recipe from "./screens/Recipe";
import { StripeProvider } from "@stripe/stripe-react-native";
import UploadBlog from "./screens/UploadBlog";
import EventRecipe from "./screens/EventRecipe";
import GroceryStores from "./screens/GroceryStores";
//import RecipeHome from "./screens/RecipeHome";
import LiveStreamHost from "./screens/LiveStreamHost";
import LiveStreamViewer from "./screens/LiveStreamViewer";
import DailyCoMeeting from "./screens/DailyCoMeeting";
import Ingredient from "./screens/Ingredient";
import RecipeResults from "./screens/RecipeResults";

const Stack = createNativeStackNavigator();

export default function App() {
  const stripe_key =
    "pk_test_51OwjelIu1YXMSFeydq78Yp3opOgqM2d4yVYslwXmonbmemxNUkWrugcJth9I8ACMm6tGhSptOkJyeamy6DIddFMT00zQqpuoBh";
  return (
    <NavigationContainer>
      <StripeProvider publishableKey={stripe_key}>
        <Stack.Navigator initialRouteName="login">
          <Stack.Screen
            name="login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="signup"
            component={Signup}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="navigation"
            component={DrawerNavigation}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="forgotpassword"
            component={ForgotPassword}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="profile"
            component={Profile}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="editprofile"
            component={EditProfile}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="scanner"
            component={Scanner}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="calendar"
            component={CalendarScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="createmealplan"
            component={CreateMealPlan}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="searchrecipe"
            component={SearchRecipe}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="healthform"
            component={HealthForm}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="add"
            component={Add}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="save"
            component={Save}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="fetch"
            component={Fetch}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="otheruserprofile"
            component={OtherUserProfile}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="postdetail"
            component={PostDetail}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="editpost"
            component={EditPost}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="playlist"
            component={Playlist}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="reels"
            component={Reels}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="saveplaylist"
            component={SavePlaylist}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="otherplaylist"
            component={OtherPlaylist}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="playlistdetail"
            component={PlaylistDetail}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="editvideo"
            component={EditVideo}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="meeting"
            component={Meeting}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="meetingdetail"
            component={MeetingDetail}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AddMeal"
            component={AddMeal}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MyMealPlans"
            component={MyMealPlans}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MealDetail"
            component={MealDetail}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="GroceryList"
            component={GroceryList}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MyGrocery"
            component={MyGrocery}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MyEventPlans"
            component={MyEventPlans}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EventCalendar"
            component={EventCalendar}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AddRecipeForEvent"
            component={AddRecipeForEvent}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EventSearch"
            component={EventSearch}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EventDetails"
            component={EventDetails}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Recipe"
            component={Recipe}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="uploadblog"
            component={UploadBlog}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EventRecipe"
            component={EventRecipe}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="GroceryStores"
            component={GroceryStores}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="LiveStreamHost"
            component={LiveStreamHost}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="LiveStreamViewer"
            component={LiveStreamViewer}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DailyCoMeeting"
            component={DailyCoMeeting}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Ingredient"
            component={Ingredient}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="RecipeResults"
            component={RecipeResults}
            options={{
              headerShown: false,
            }}
          />

        </Stack.Navigator>

      </StripeProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
