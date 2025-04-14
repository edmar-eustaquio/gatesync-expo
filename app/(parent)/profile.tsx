import { useAppContext } from "@/AppProvider";
import CustomTopbar from "@/components/CustomTopbar";
import { uploadImage } from "@/helper/cloudinary";
import { selectImage } from "@/helper/ImageSelector";
import useFirebaseHook from "@/hooks/useFirebaseHook";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  TextInput,
} from "react-native";

const ProfileScreen = () => {
  const { user, setUser } = useAppContext();

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(user?.name);
  const [contactNumber, setContactNumber] = useState(user?.contactNumber);
  const [email] = useState(user?.email);

  const { isLoading, dispatch } = useFirebaseHook();

  const handleSaveChanges = () =>
    dispatch({
      process: async ({ update, get, where }) => {
        if (!user?.id) return;

        await update("users", user?.id, {
          name: name,
          contactNumber: contactNumber,
        });

        setUser({
          id: user?.id,
          name: name,
          contactNumber: contactNumber,
          email: email,
          image: user?.image,
        });

        const linkingData = {
          parentName: name,
          parentContactNumber: contactNumber,
        };
        get("linkings", where("parentId", "==", user?.id)).then(({ docs }) => {
          for (const dc of docs) update("linkings", dc.id, linkingData);
        });

        Alert.alert("Success", "Profile updated successfully");
        setModalVisible(false);
      },
      onError: (error) => {
        console.error("Error updating profile:", error);
        Alert.alert("Error", "Failed to update profile");
      },
    });

  const onSendImage = async () => {
    if (!user?.id) return;

    const image = await selectImage();
    if (!image) return;

    dispatch({
      process: async ({ update, get, where }) => {
        const imageUrl = await uploadImage(image, `image_${Date.now()}`);
        if (!imageUrl) {
          Alert.alert("Error", "Unable to save image!!!");
          return;
        }

        await update("users", user?.id, {
          image: imageUrl,
        });

        setUser({
          ...user,
          image: imageUrl,
        });

        const linkingData = {
          parentImage: imageUrl,
        };
        get("linkings", where("parentId", "==", user?.id)).then(({ docs }) => {
          for (const dc of docs) update("linkings", dc.id, linkingData);
        });

        Alert.alert("Successfully changed profile image.");
      },

      onError: (error) => {
        Alert.alert("Error", "Error changing profile image!!!");
      },
    });
  };

  return (
    <>
      <CustomTopbar title="Profile" />

      <View style={styles.container}>
        {/* Profile Details Container */}
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={onSendImage}>
            <Image
              source={
                user?.image
                  ? { uri: user.image }
                  : require("@/assets/images/account_circle.png")
              }
              style={styles.profileicon}
            />
          </TouchableOpacity>
          <Text style={styles.infolabel}>NAME:</Text>
          <Text style={styles.username}>{name}</Text>

          <Text style={styles.infolabel}>CONTACT:</Text>
          <Text style={styles.username}>{contactNumber}</Text>

          <Text style={styles.infolabel}>EMAIL:</Text>
          <Text style={styles.infomail}>{email}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Profile Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Profile</Text>

              <TextInput
                style={styles.input}
                placeholder="User Name"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Course"
                value={contactNumber}
                onChangeText={(text) =>
                  setContactNumber(text.replace(/[^0-9]/g, ""))
                } // Allow only numbers
                keyboardType="numeric"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveChanges}
                >
                  <Text style={styles.modalButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#BCE5FF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  navCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 35,
    height: 34,
    resizeMode: "contain",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    left: "-60%",
  },
  gatesync: {
    width: 100,
    height: 34,
    top: 5,
    resizeMode: "contain",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    left: "-60%",
  },
  back: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  profileicon: {
    width: 144,
    height: 137,
    alignSelf: "center",
  },
  usernamne: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    color: "black",
  },
  course: {
    right: 25,
    top: "-4.5%",
    fontSize: 16,
    alignSelf: "center",
    fontWeight: "800",
  },
  infolabel: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000",
    marginTop: 20,
    left: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 140,
    top: "-4.5%",
  },
  infoid: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 140,
    top: "-4.5%",
  },
  infolevel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 140,
    top: "-4.5%",
  },
  infomail: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 140,
    top: "-4.5%",
  },
  editButton: {
    backgroundColor: "#6B9BFA",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
    top: "1%",
  },
  editButtonText: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "bold",
  },

  // Profile container with gradient and shadow
  profileContainer: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    paddingTop: 10,
    elevation: 5,
    height: 540,
    width: "90%",
    alignSelf: "center",
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#D3D3D3",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#6B9BFA",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
