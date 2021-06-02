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
  TouchableOpacity
} from 'react-native';
import {AuthContext} from './context/Context';


// import auth from '@react-native-firebase/auth';
const {width, height} = Dimensions.get("window");

function LoginScreen({navigation, route}) {
	const [state, update] = useContext(AuthContext);

	const signinAnon = async () => {
		update({
			type: "LOGIN"
		});
		return;
		auth()
		.signInAnonymously()
		.then(() => {
			console.log('User signed in anonymously');
		}).catch(error => {
			if (error.code === 'auth/operation-not-allowed') {
				console.log('Enable anonymous in your firebase console.');
			}

			console.error(error);
		});
	}

	const googleSignIn = async () => {

		update({
			type: "LOGIN"
		});
		return;
		const { idToken } = await GoogleSignin.signIn();

		// Create a Google credential with the token
		const googleCredential = auth.GoogleAuthProvider.credential(idToken);

		// Sign-in the user with the credential
		await auth().signInWithCredential(googleCredential);

	}
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.appHeader}>
				<Text style={[styles.appText,{color: 'red'}]}>My</Text>
				<Text style={styles.appText}> Notes</Text>
			</View>
			<View style={styles.optionContainer}>
				<Text>Login here using</Text>
				<TouchableOpacity style={styles.anonymouslyButton} onPress={signinAnon}>
					<Text style={styles.anonymouslyText}>Anonymously</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.anonymouslyButton} onPress={googleSignIn}>
					<Text style={styles.anonymouslyText}>Google</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>	
	);
}

const styles = StyleSheet.create({
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
	optionContainer: {
		flex: 2,
	},
	anonymouslyButton: {
		backgroundColor: '#424242',
		paddingHorizontal: 30,
		paddingVertical: 10,
		marginVertical: 20,
		alignItems: 'center',
		borderRadius: 10
	},
	anonymouslyText: {
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold'
	}
})

export default LoginScreen; 