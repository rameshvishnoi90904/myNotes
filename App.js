import React, {useContext, useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Dimensions,
  TextInput,
} from 'react-native';

import CategoryOverview from './CategoryOverview';
import CategoryListing from './CategoryListing';
import NoteView from './NoteView';
import LoginScreen from './LoginScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
const RootStack = createStackNavigator();
const {width, height} = Dimensions.get('window');
import AsyncStorage from '@react-native-community/async-storage';


import {AuthController, AuthContext} from './context/Context';
import { TouchableOpacity } from 'react-native-gesture-handler';

const MainStackScreen = () => {
	const [state, update] = useContext(AuthContext);
	const [initialLoading, setInitialLoading] = useState(true);
	useEffect(() => {
		AsyncStorage.getItem("@userData").then((value) => {
			if (value) {
				update({type: 'INITIALIZE', data: JSON.parse(value)});
			}
			setInitialLoading(false)
		});
	},[]);

	if (initialLoading)	{
		return (
			<SafeAreaView style={{flex: 1}}>
				<View style={styles.appHeader}>
					<Text style={[styles.appText,{color: 'red'}]}>My</Text>
					<Text style={styles.appText}> Notes</Text>
				</View>
			</SafeAreaView>
		)
	}
  return (
	<Stack.Navigator >
		{
			!state.loggedIn ?
			<Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
			:
			<>
				<Stack.Screen name="My Notes" component={CategoryOverview} options={{ headerShown: false }}/>
				<Stack.Screen name="Listing" component={CategoryListing} />
				<Stack.Screen name="Note" component={NoteView} />
			</>
		}
	</Stack.Navigator>
  )
};

function ModalScreen({ navigation }) {
	const [state, update] = useContext(AuthContext);
	const [newCategory, setNewCategory] = useState("");
	const [selectedCategory, setCategory] = useState("");
	
	const onNewCategoryInput = (value) => {
		setCategory("");
		setNewCategory(value);
	}

	const addNote = () => {
		const categoryValue = newCategory || selectedCategory;
		if (newCategory) {
			update({type: 'ADD_NEW_CATEGORY', data: {category: newCategory}})
		}
		navigation.navigate("Note",{
			category: categoryValue
		});
	}

	const onCategorySelect = (value) => {
		setCategory(value);
		setNewCategory("");
	}
	const categoryPreview = state.categories.map((cItem) => {
		return (
			<TouchableOpacity key={cItem.name} style={[styles.categoryNameWrapper, (selectedCategory == cItem.name) ? styles.selectedCategory : {}]} onPress={() => {onCategorySelect(cItem.name)}} >
				<Text style={styles.categoryName}>{cItem.name}</Text>
			</TouchableOpacity>
		)
	});
	return (
	  <View style={{ height: 2 * height/3, top: height/6, backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 10, marginHorizontal: 10, borderRadius: 10}}>
		<Text style={{ fontSize: 30, marginBottom: 10 }}>Add new notes</Text>
		<Text style={{ fontSize: 16 }}>Select existing Category </Text>
		<View style={{flex: 1}}>
			<View style={styles.categorySelector}>
				{categoryPreview}
			</View>
		</View>
		<View>
			<Text style={{ fontSize: 16 }}>or create new</Text>
			<View>
				<TextInput style={styles.input} value={newCategory} onChangeText={onNewCategoryInput}/>
			</View>
		</View>
		<View style={styles.buttonContainer}>
			<Button onPress={() => navigation.goBack()} title="Dismiss" style={[styles.button, styles.cancelButton]}/>
			<Button disabled={!(newCategory !== "" || selectedCategory !== "")} onPress={addNote} title="Proceed" style={[styles.button, styles.proceedButton]}/>
		</View>
	  </View>
	);
  }

function RootStackScreen() {
	const modalOptions = {
		headerShown: false,
		cardStyle: { backgroundColor: "transparent" },
		cardOverlayEnabled: true,
		cardStyleInterpolator: ({ current: { progress } }) => ({
			cardStyle: {
				opacity: progress.interpolate({
					inputRange: [0, 0.5, 0.9, 1],
					outputRange: [0, 1, 1, 1]
				})
			},
			overlayStyle: {
				opacity: progress.interpolate({
					inputRange: [0, 1],
					outputRange: [0, 0.6],
					extrapolate: "clamp"
				})
			}
		})
	};

	

	return (
		<AuthController>
			<StatusBar barStyle={'dark-content'} />
			<NavigationContainer>
				<RootStack.Navigator mode="modal">
					<RootStack.Screen
						name="Main"
						component={MainStackScreen}
						options={{ headerShown: false }}
					/>
					<RootStack.Screen 
						name="MyModal"
						options={{ headerShown: false }}
						component={ModalScreen} 
						options={modalOptions}
					/>
				</RootStack.Navigator>
			</NavigationContainer>	
		</AuthController>
	);
  }

const styles = StyleSheet.create({
	sectionContainer: {
		marginTop: 32,
		paddingHorizontal: 24,
	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: '600',
	},
	sectionDescription: {
		marginTop: 8,
		fontSize: 18,
		fontWeight: '400',
	},
	highlight: {
		fontWeight: '700',
	},
	categorySelector: {
		flexDirection: 'row',
		marginVertical: 40,
		flexWrap: 'wrap'
	},
	categoryNameWrapper: {
		paddingHorizontal: 30,
		paddingVertical: 10,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#424242',
		marginRight: 15,
		marginBottom: 15
	},
	categoryName: {
		fontSize: 22
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	input: {
		borderWidth: 1,
		marginVertical: 10,
		fontSize: 22,
		paddingVertical: 10,
		paddingHorizontal: 10,
	},
	selectedCategory: {
		backgroundColor: "#EFEFEF"
	},
	container: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',
	},
	appHeader: {
		justifyContent: 'center',
		paddingVertical: 50,
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center'
	},
	appText: {
		fontSize: 50,
		fontWeight: 'bold',
		color: '#1A237E'
	},
});

export default RootStackScreen;
