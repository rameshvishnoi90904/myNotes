import React, { useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
	loggedIn: false,
	categories: [
		{
			name: 'Personal',notes:[]
		},
		{
			name: 'Works',notes:[]
		},
		{
			name: 'Ideas',notes:[]
		},
		{
			name: 'Lists',notes:[]
		},
	]
}


const updater = (prevState, action) => {
	console.log("updater called ", prevState, action);
	var updatedState = { ...prevState};
	var toReturn;
	switch (action.type) {
		case 'LOGIN': {
			toReturn = {
				...prevState,
				loggedIn: true
			}
			break;
		}
		case 'INITIALIZE' : {
			const data = action.data;
			return {...data, loggedIn: false}
		}
		case 'ADD_NEW_NOTE': {
			const category = action.data.category;
			const toAddNote = action.data.toAddNote;
			

			const updatedCategories = [...prevState.categories];
			const cIndex = updatedCategories.findIndex((cItem) => {
				return (cItem.name == category)
			});

			if (cIndex == -1) {
				// category not found
			} else {
				const categoryNotes = updatedCategories[cIndex].notes;
				const udpatedNotes = [...categoryNotes, {id: categoryNotes.length + 1, data: toAddNote, lastUpdateOn: new Date().toISOString()}];

				toReturn = {
					...prevState,
					categories: [
						...prevState.categories.map((c) => {
							if (c.name !== category) {
								return c;
							} else {
								return {
									name: category,
									notes: udpatedNotes
								};
							}	
						})
					]
				}
			}
			
			break;
		}	
		case 'ADD_NEW_CATEGORY':{
			const category = action.data.category;
			// check if category already present
			const cIndex = prevState.categories.findIndex((cItem) => {
				return (cItem.name == category);
			});

			if (cIndex == -1) {
				toReturn =  {
					...prevState,
					categories: [...prevState.categories, {name: category, notes: []}]
				}
			} else {
				toReturn = {
					...prevState
				}
			}
			break;
		}
		case 'UPDATE_NOTE': {
			const category = action.data.category;
			const noteId = action.data.noteId;
			const noteData = action.data.data;

			const categoryItem = prevState.categories.find((c) => c.name === category);

			toReturn = {
				...prevState,
				categories: [
					...prevState.categories.filter((c) => c.name !== category),
					{
						name: category,
						notes: [
							...categoryItem.notes.filter((n) => n.id !== noteId),
							{
								id: noteId,
								data: noteData,
								lastUpdateOn: new Date().toISOString()
							}
						]
					}
				]
			}

		}
	
	}
	if (toReturn) {
		AsyncStorage.setItem("@userData", JSON.stringify(toReturn));
		return toReturn;
	} else {
		return prevState;
	}
};


const initialContext = [{ ...initialState }, () => {}];
export const AuthContext = React.createContext(initialContext);

export function AuthController(props) {
	const [state, dispatch] = useReducer(updater, initialState);
	const authContext = useMemo(() => [state, dispatch], [state]);
	return (<AuthContext.Provider value={authContext}>
		{props.children}
	</AuthContext.Provider>);
}

AuthController.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]).isRequired
};
