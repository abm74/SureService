import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/UI/dialog";
import { Button } from "@/Components/UI/button";
import { Input } from "@/Components/UI/input";
import { Label } from "@/Components/UI/label";
import { Textarea } from "@/Components/UI/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/UI/select";
import { useCategories } from "@/hooks/useCategories";
import { useLocations } from "@/hooks/useLocations";
import { useAdminUpdateUser } from "@/hooks/useAdmin";
import { getErrorMessage } from "@/utils/helpers";
import type { User, UserRole, VerificationStatus } from "@/types";

interface UserEditModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updated: User) => void;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { categories = [] } = useCategories();
  const { cities = [], getSubCities } = useLocations();
  const updateMutation = useAdminUpdateUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [category, setCategory] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [selectedCity, setSelectedCity] = useState("Addis Ababa");
  const [subCity, setSubCity] = useState("Bole");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("unverified");
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const subCities = getSubCities(selectedCity);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setRole(user.role || "customer");
      setCategory(user.category || "");
      setHourlyRate(user.hourlyRate ? String(user.hourlyRate) : "");
      setExperienceYears(user.experienceYears ? String(user.experienceYears) : "");
      setSelectedCity(user.location?.city || "Addis Ababa");
      setSubCity(user.location?.subCity || "Bole");
      setAddress(user.location?.address || "");
      setBio(user.bio || "");
      setSkills(user.skills ? user.skills.join(", ") : "");
      setVerificationStatus(user.verificationStatus || "unverified");
      setRejectionReason(user.verificationRejectionReason || "");
      setError(null);
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const skillsArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: any = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
        bio: bio.trim(),
        location: {
          city: selectedCity,
          subCity,
          address: address.trim(),
        },
      };

      if (role === "provider") {
        payload.category = category;
        payload.hourlyRate = hourlyRate ? Number(hourlyRate) : 0;
        payload.experienceYears = experienceYears ? Number(experienceYears) : 0;
        payload.skills = skillsArray;
        payload.verificationStatus = verificationStatus;
        if (verificationStatus === "rejected") {
          payload.verificationRejectionReason = rejectionReason.trim() || "Requirements not met";
        }
      }

      const updated = await updateMutation.mutateAsync({
        userId: user.id,
        payload,
      });

      if (onSuccess) onSuccess(updated);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update user profile."));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader className="text-left">
          <DialogTitle className="text-lg font-bold text-ink">
            Edit User Profile: {user.name}
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Update account details, role, and marketplace attributes.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-left pt-2">
          {error && (
            <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Phone Number</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+251 91 234 5678"
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Account Role</Label>
              <Select value={role} onValueChange={(val: UserRole) => setRole(val)}>
                <SelectTrigger className="h-9 text-xs rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="provider">Service Provider</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">City</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-9 text-xs rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Sub-City / District</Label>
              <Select value={subCity} onValueChange={setSubCity}>
                <SelectTrigger className="h-9 text-xs rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subCities.map((sc: string) => (
                    <SelectItem key={sc} value={sc}>{sc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Street Address / Woreda</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Woreda 03, House 412"
              className="h-9 text-xs rounded-xl"
            />
          </div>

          {role === "provider" && (
            <div className="pt-2 border-t border-border space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Provider Specific Attributes
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Primary Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-9 text-xs rounded-xl">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.slug} value={cat.name}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Hourly Rate (ETB)</Label>
                  <Input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="350"
                    className="h-9 text-xs rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Experience (Years)</Label>
                  <Input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="5"
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Skills (Comma-separated)</Label>
                <Input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Wiring, Circuit Breakers, Solar Setup"
                  className="h-9 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Verification Status</Label>
                <Select
                  value={verificationStatus}
                  onValueChange={(val: VerificationStatus) => setVerificationStatus(val)}
                >
                  <SelectTrigger className="h-9 text-xs rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unverified">Unverified</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="approved">Approved & Verified (+25 pts)</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {verificationStatus === "rejected" && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Rejection Feedback</Label>
                  <Input
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Clear copy of ID required..."
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Bio / Overview</Label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="text-xs rounded-xl"
                />
              </div>
            </div>
          )}

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={updateMutation.isPending}
              className="rounded-xl text-xs h-9"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal;
