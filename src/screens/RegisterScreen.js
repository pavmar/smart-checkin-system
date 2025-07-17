import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Card, Title, HelperText } from 'react-native-paper';
import { theme } from '../theme/theme';
import { registerUser } from '../services/api';
import { generateUniqueId } from '../utils/idGenerator';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const uniqueId = generateUniqueId();
      const userData = {
        ...formData,
        uniqueId,
      };
      
      const response = await registerUser(userData);
      
      Alert.alert(
        'Registration Successful!',
        `Your unique ID is: ${uniqueId}`,
        [
          {
            text: 'View QR Code',
            onPress: () => navigation.navigate('QRCode', { userId: uniqueId, userData }),
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>User Registration</Title>
            
            <TextInput
              label="First Name"
              value={formData.firstName}
              onChangeText={(value) => updateField('firstName', value)}
              style={styles.input}
              error={!!errors.firstName}
              mode="outlined"
            />
            <HelperText type="error" visible={!!errors.firstName}>
              {errors.firstName}
            </HelperText>

            <TextInput
              label="Last Name"
              value={formData.lastName}
              onChangeText={(value) => updateField('lastName', value)}
              style={styles.input}
              error={!!errors.lastName}
              mode="outlined"
            />
            <HelperText type="error" visible={!!errors.lastName}>
              {errors.lastName}
            </HelperText>

            <TextInput
              label="Mobile Number"
              value={formData.mobile}
              onChangeText={(value) => updateField('mobile', value)}
              style={styles.input}
              error={!!errors.mobile}
              mode="outlined"
              keyboardType="phone-pad"
              maxLength={10}
            />
            <HelperText type="error" visible={!!errors.mobile}>
              {errors.mobile}
            </HelperText>

            <TextInput
              label="Email Address"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              style={styles.input}
              error={!!errors.email}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              Register User
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 20,
  },
  card: {
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.colors.primary,
    marginBottom: 20,
  },
  input: {
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
});

export default RegisterScreen;
