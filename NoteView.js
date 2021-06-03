
import React, {useContext, useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';

import {AuthContext} from './context/Context';
const {width, height} = Dimensions.get('window');
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {actions, getContentCSS, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
function NoteView({navigation, route}) {
	const [state, update] = useContext(AuthContext);
	const [loading, setLoading] = useState(true);
	const richText = useRef(null);
	const noteData = route.params.noteData;
	const category = route.params.category;
	const onEditorInitialized = () => {
		if (noteData) {
			richText.current?.insertHTML(noteData.data);
		}
		setLoading(false);
	}

	const onDismiss = () => {
		navigation.goBack()
	}

	const onSave = async () => {
		setLoading(true);
		let html = await richText.current?.getContentHtml();
		setLoading(false);
		if (noteData) {
			update({type: 'UPDATE_NOTE', data: {
				category: category,
				noteId: noteData.id,
				data: html
			}});
		} else {
			update({type: 'ADD_NEW_NOTE', data: {
				category: category,
				toAddNote: html
			}});
		}
		
		navigation.goBack();
	} 
	const onPressAddImage = () => {
		// open camera or gallary here and insert image
		launchImageLibrary({
			mediaType: 'photo',	
			includeBase64: true,
			quality: 0.4
		}, (response) => {
			richText.current?.insertImage(
			`data:image/jpeg;base64,${response.assets[0].base64}`,
            'background: gray;',
        	);
		})
	}

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
			<SafeAreaView style={{ flex: 1}}>
				<RichToolbar
						style={styles.richBar}
						flatContainerStyle={styles.flatStyle}
						editor={richText}
						selectedIconTint={'#2095F2'}
						disabledIconTint={'#bfbfbf'}
						onPressAddImage={onPressAddImage}
						actions={[
								actions.undo,
								actions.redo,
								actions.insertImage,
								actions.setStrikethrough,
								actions.checkboxList,
								actions.insertOrderedList,
								actions.blockquote,
								actions.alignLeft,
								actions.alignCenter,
								actions.alignRight,
							]}
					/>
				<RichEditor
					style={styles.rich}
					initialHeight={400}
					useContainer={true}
					ref={richText}
					placeholder={'please input content'}	
					editorInitializedCallback={onEditorInitialized}
				/>
				
				{
					loading &&
					<View style={{position: 'absolute', width: width, height: height, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
						<ActivityIndicator size={"large"}/>
					</View>
				}
				<View style={styles.buttonContainer}>
					<View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
						<View style={styles.categoryNameWrapper}>
							<Text style={styles.categoryName}>{category}</Text>
						</View>
					</View>
					<View style={{marginHorizontal: 10}}>
						<Button onPress={onDismiss} title="Cancel" color="red" style={[styles.button, styles.cancelButton]}/>
					</View>
					<Button onPress={onSave} title="Save" style={[styles.button, styles.proceedButton]}/>
				</View>
			</SafeAreaView>
		</KeyboardAvoidingView>
			 
		
	);
}

const styles = StyleSheet.create({
	rich: {
        minHeight: 300,
        flex: 1,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#e3e3e3'
    },
	buttonContainer: {
		paddingHorizontal: 20,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	richBar: {
        borderColor: '#efefef',
        borderTopWidth: StyleSheet.hairlineWidth,
    },
	flatStyle: {
        paddingHorizontal: 12,
    },
	categoryNameWrapper: {
		paddingHorizontal: 20,
		paddingVertical: 5,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#424242',
		marginRight: 15,
		marginBottom: 15,
		marginTop: 5
	},
	categoryName: {
		fontSize: 14
	},
})

export default NoteView; 