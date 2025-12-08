"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { UserProfile } from "../../types/auth.types";
import { useAuthStore } from "../../store/slices/auth.slice";
import { API_ENDPOINTS } from "../../constants/routes";
import { FetchClient } from "../../lib/api/client";

const DEFAULT_AVATAR = "/assets/images/logos/lawvriksh-logo.png";
const DEFAULT_COVER = "/assets/images/background-image/backgroundImage.png";

export default function Profile({ user }: { user: UserProfile }) {
  const { updateProfile, getProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState<UserProfile>(user);
  const [error, setError] = useState("");
  const [interestsInput, setInterestsInput] = useState(
    () => editableUser.interests?.join(", ") || ""
  );
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const formattedMemberSince = useMemo(() => {
    return new Date(user.created_at || new Date()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [user.created_at]);

  const handleGenericChange = useCallback((field: keyof UserProfile, value: string) => {
    setEditableUser((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleInterestsChange = useCallback((value: string) => {
    setInterestsInput(value);
  }, []);

  const handleAvatarUpload = useCallback(async (file: File) => {
    setIsUploadingAvatar(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'profile');

      const response = await FetchClient.makeRequest(API_ENDPOINTS.INIT_IMAGE_UPLOAD, {
        method: 'POST',
        body: formData,
      });

      if (response.success) {
        const uploadData = response.data as any;
        
        // Complete the upload if needed
        if (uploadData.upload_url) {
          await fetch(uploadData.upload_url, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type,
            },
          });
        }

        // Update profile with new image URL
        setEditableUser(prev => ({
          ...prev,
          picture: uploadData.permanent_url || uploadData.url
        }));
      }
    } catch (error) {
      setError(`Avatar upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploadingAvatar(false);
      setUploadProgress(0);
    }
  }, []);

  const handleCoverUpload = useCallback(async (file: File) => {
    setIsUploadingCover(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'cover');

      const response = await FetchClient.makeRequest(API_ENDPOINTS.INIT_IMAGE_UPLOAD, {
        method: 'POST',
        body: formData,
      });

      if (response.success) {
        const uploadData = response.data as any;
        
        if (uploadData.upload_url) {
          await fetch(uploadData.upload_url, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type,
            },
          });
        }

        setEditableUser(prev => ({
          ...prev,
          cover_image: uploadData.permanent_url || uploadData.url
        }));
      }
    } catch (error) {
      setError(`Cover image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploadingCover(false);
      setUploadProgress(0);
    }
  }, []);

  const handleAvatarSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedAvatarFile(file);
      handleAvatarUpload(file);
    }
  }, [handleAvatarUpload]);

  const handleCoverSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedCoverFile(file);
      handleCoverUpload(file);
    }
  }, [handleCoverUpload]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      const processedInterests = interestsInput
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);

      const updatedUserData = {
        ...editableUser,
        interests: processedInterests,
      };

      const updatePayload: Partial<UserProfile> = {};
      (Object.keys(updatedUserData) as Array<keyof UserProfile>).forEach((key) => {
        if (JSON.stringify(updatedUserData[key]) !== JSON.stringify(user[key])) {
          (updatePayload as any)[key] = updatedUserData[key];
        }
      });

      if (Object.keys(updatePayload).length === 0) {
        setIsEditing(false);
        return;
      }

      try {
        const response = await updateProfile(updatePayload as any);
        if (response.success) {
          setIsEditing(false);
          await getProfile();
          setEditableUser(updatedUserData);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred while updating the profile");
      }
    },
    [editableUser, interestsInput, updateProfile, user, getProfile]
  );

  const handleCancel = useCallback(() => {
    setEditableUser(user);
    setInterestsInput(user.interests?.join(", ") || "");
    setIsEditing(false);
  }, [user]);

  const handleDeleteAccount = useCallback(async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const response = await FetchClient.makeRequest(API_ENDPOINTS.ACCOUNT_DELETE, {
          method: 'DELETE',
        });
        
        if (response.success) {
          // Redirect to login or home page
          window.location.href = '/login';
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to delete account");
      }
    }
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg m-4">
          {error}
        </div>
      )}

      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-stone-100 to-stone-200">
        <img
          src={editableUser.cover_image || DEFAULT_COVER}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        {isEditing && (
          <button
            onClick={() => coverInputRef.current?.click()}
            disabled={isUploadingCover}
            className="absolute top-4 right-4 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white/90 transition-colors text-sm"
          >
            {isUploadingCover ? 'Uploading...' : 'Change Cover'}
          </button>
        )}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverSelect}
          className="hidden"
        />
      </div>

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto px-8 -mt-20 pb-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Avatar and Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="relative -mt-20">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-stone-200">
                  <img
                    src={editableUser.picture || DEFAULT_AVATAR}
                    alt={`${editableUser.name || editableUser.username || "User"}'s avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-[#393634] rounded-full flex items-center justify-center text-white hover:bg-[#2a2725] transition-colors"
                  >
                    {isUploadingAvatar ? '...' : '+'}
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarSelect}
                  className="hidden"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2 text-[#393634]">
                  {editableUser.name || editableUser.username || "N/A"}
                </h1>
                <p className="text-gray-600 mb-2">{editableUser.email}</p>
                <span className="inline-block px-3 py-1 bg-stone-100 text-stone-700 text-sm font-medium rounded">
                  {editableUser.role}
                </span>
              </div>
            </div>

            {!isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors text-[#393634]"
                  type="button"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                  type="button"
                >
                  Delete Account
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#393634]">Full Name</label>
                <input
                  type="text"
                  value={editableUser.name || ""}
                  onChange={(e) => handleGenericChange("name", e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#393634]">Email</label>
                <input
                  type="email"
                  value={editableUser.email || ""}
                  onChange={(e) => handleGenericChange("email", e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#393634]">Profession</label>
                <input
                  type="text"
                  value={editableUser.profession || ""}
                  onChange={(e) => handleGenericChange("profession", e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#393634]">Phone</label>
                <input
                  type="tel"
                  value={editableUser.phone || ""}
                  onChange={(e) => handleGenericChange("phone", e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#393634]">Interests</label>
                <input
                  type="text"
                  value={interestsInput}
                  onChange={(e) => handleInterestsChange(e.target.value)}
                  placeholder="Separate with commas"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#393634]">Bio</label>
                <textarea
                  value={editableUser.bio || ""}
                  onChange={(e) => handleGenericChange("bio", e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors text-[#393634]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#393634] text-white rounded-lg hover:bg-[#2a2725] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Personal Details */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-[#393634]">Personal Details</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Profession</h3>
                    <p className="text-[#393634]">{editableUser.profession || "Not Provided"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                    <p className="text-[#393634]">{editableUser.phone || "Not Provided"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {editableUser.interests && editableUser.interests.length > 0 ? (
                        editableUser.interests.map((interest, index) => (
                          <span
                            key={`${interest}-${index}`}
                            className="px-3 py-1 bg-stone-100 text-stone-700 text-sm rounded"
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">Not Provided</p>
                      )}
                    </div>
                  </div>
                </div>

                {editableUser.bio && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
                    <p className="text-[#393634]">{editableUser.bio}</p>
                  </div>
                )}
              </div>

              {/* Account Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-[#393634]">Account Information</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">User ID</h3>
                    <p className="text-[#393634]">{editableUser.user_id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Member Since</h3>
                    <p className="text-[#393634]">{formattedMemberSince}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Email Verified</h3>
                    <p className="text-[#393634]">{(editableUser as any).email_verified ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Account Status</h3>
                    <p className="text-[#393634]">{(editableUser as any).is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
