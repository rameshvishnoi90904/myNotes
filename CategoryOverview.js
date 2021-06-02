
import React, {useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
import {AuthContext} from './context/Context';


function CategoryOverviewScreen({navigation}) {
	const [state, update] = useContext(AuthContext);

	const navigateToDetail = (name) => {
		navigation.navigate("Listing",{
			category: name
		})
	};

	const openAddNotes = () => {
		navigation.navigate("MyModal")
	}

	const categoryOverview = state.categories.map((cItem, index) => {
		return (
			<TouchableOpacity onPress={() => {navigateToDetail(cItem.name)}} key={cItem.name}>
				<View style={styles.categoryItem}>
					<View style={styles.nameContainer}>
						<Text style={[styles.nameText, (index == 1) ? styles.secondaryColorText:{}]}>{cItem.name}</Text>
					</View>
					<View style={styles.summaryContainer}>
						<Text style={[styles.countText, (index == 1) ? styles.secondaryColorText:{}]}>{cItem.notes.length}</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	})
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<View style={styles.appHeader}>
				<Text style={[styles.appText,{color: 'red'}]}>My</Text>
				<Text style={styles.appText}> Notes</Text>
			</View>
			<ScrollView style={{}} contentContainerStyle={{}}>
			{categoryOverview}			
			</ScrollView>
			<TouchableOpacity style={styles.floatingAdd} onPress={openAddNotes}>
				<Text style={styles.addText}>+</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	appHeader: {
		justifyContent: 'center',
		paddingVertical: 20,
		flexDirection: 'row'
	},
	appText: {
		fontSize: 50,
		fontWeight: 'bold',
		color: '#1A237E'
	},
	sectionContainer: {
		marginTop: 32,
		paddingHorizontal: 24,
	},
	categoryItem: {
		flexDirection: 'row',
		marginHorizontal: 30,
		paddingVertical: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#1A237E'
	},
	nameContainer: {
		flex: 1
	},
	summaryContainer: {
	},
	nameText: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#1A237E'
	},
	secondaryColorText: {
		color: 'red'
	},
	countText: {
		fontSize: 32,
		color: '#1A237E'
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
});

  
export default CategoryOverviewScreen 