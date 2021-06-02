
import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity
} from 'react-native';

import {AuthContext} from './context/Context';
import { WebView } from 'react-native-webview';
import {RichEditor} from 'react-native-pell-rich-editor';

function CategoryListingScreen({navigation, route}) {
	const [state, update] = useContext(AuthContext);
	const category = route.params.category;
	const cData = state.categories.find((cItem) => {
		return (cItem.name == category);
	});

	React.useLayoutEffect(() => {
		navigation.setOptions({
		  title: ''
		});
	  }, [navigation]);


	const navigateToNotes = (nData) => {
		navigation.navigate("Note",{
			category:category,
			noteData: nData
		});
	}

	const openAddNotes = () => {
		navigation.navigate("Note",{
			category: category
		});
	}

	let notesPreview = [];
	if (cData) {
		notesPreview = cData.notes.map((nItem) => {
			return (
				<View key={nItem.id} style={[styles.noteItem, styles.shadow]} >
					{
						nItem.lastUpdateOn &&
						<Text style={styles.timeStampText}>{new Date(nItem.lastUpdateOn).toDateString()}</Text>
					}
					<RichEditor
						disabled={true}
						initialContentHTML={nItem.data}
					/>
					<TouchableOpacity onPress={() => {navigateToNotes(nItem)}}>
						<Text style={[styles.timeStampText,{textAlign: 'right'}]}>View note...</Text>
					</TouchableOpacity>
				</View>
			)
		});

		if (cData.notes.length == 0) {
			notesPreview = (
				<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
					<Text>No Notes added yet!</Text>
				</View>
			)
		}
	}

	
	return (
		<View style={styles.container}>
			{notesPreview}
			<TouchableOpacity style={styles.floatingAdd} onPress={openAddNotes}>
				<Text style={styles.addText}>+</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 10,
		backgroundColor: 'white'
	},
	noteItem: {
		backgroundColor: 'white',
		marginBottom: 20, 
		paddingVertical: 10,
		borderRadius: 10 ,
		// minHeight: 200,
	},
	timeStampText: {
		color: 'red',
		fontWeight: 'bold',
		paddingHorizontal: 10
	},
	shadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,
	},
	addText: {
		fontSize: 52,
		color: 'white'
	},
	floatingAdd: {
		position: 'absolute',
		bottom: 50,
		right: 20,
		width: 70,
		height: 70,
		borderRadius: 35,
		backgroundColor: 'red',
		alignItems: 'center',
		justifyContent: 'center'

	},
})

export default CategoryListingScreen 