import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import { Colors } from "react-native-paper";
const styles = StyleSheet.create({
  Camcontainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  backIcon: {
    position: "absolute",
    top: 45,
    left: 10,
    zIndex: 10,
    colour: "white",
  },
  containerImg: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    aspectRatio: 3 / 4,
  },
  button1: {
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
    marginVertical: 20,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  flipcamera: {},
  buttonContainer: {
    padding: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    marginVertical: 10,
    paddingVertical: 5,
    color: "#fff",
    tintColor: "#fff",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  caption: {
    color: "#5f5f5f",
  },
  droidSafeArea: {
    paddingTop: Constants.statusBarHeight,
  },
  topContainer: {
    backgroundColor: "transparent",
    paddingTop: "30%",
  },
  userRaw: {
    justifyContent: "center",
    alignItems: "flex-end",
    flexDirection: "row",
    paddingTop: 10,
    marginBottom: 10,
  },
  userDataContaienr: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  userNameRaw: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  editProfile: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  images: {
    flex: 1,
    marginLeft: 10,
    // width: useWindowDimensions().width / 3,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  iconButton: {
    backgroundColor: "white",
    elevation: 10,
    borderColor: "black",
    borderWidth: 0.5,
    marginLeft: -40,
  },
  subHeading: {
    fontSize: 20,
    marginVertical: 10,
  },
  input: {
    marginVertical: 10,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  searchBarStyle: {
    padding: 0,
    marginHorizontal: 10,
    backgroundColor: "#f000",
    borderBottomColor: "#f000",
    borderTopColor: "#f000",
  },
  searchBarInput: {
    backgroundColor: "grey",
    height: 40,
    padding: 5,
  },
  userItem: {
    margin: 10,
    borderBottomColor: "grey",
    borderBottomWidth: 0.5,
  },
  pageSubTitle: {
    fontSize: 25,
    color: "grey",
    fontWeight: "600",
    marginBottom: 10,
  },
  picContainer: {
    padding: 13,
    paddingHorizontal: 40,
    marginHorizontal: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  containerVid: {
    flex: 1,
    resizeMode: "contain",
    height: "75%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;
