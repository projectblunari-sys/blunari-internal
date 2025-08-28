import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Loader2 } from "lucide-react";

interface Department {
  id: string;
  name: string;
}

interface InviteEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: Department[];
  onInviteSent: () => void;
}

export const InviteEmployeeDialog = ({
  open,
  onOpenChange,
  departments,
  onInviteSent
}: InviteEmployeeDialogProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !role) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Call edge function to send invitation
      const { error } = await supabase.functions.invoke('invite-employee', {
        body: {
          email,
          role,
          department_id: departmentId || null
        }
      });

      if (error) throw error;

      toast.success("Employee invitation sent successfully");
      onInviteSent();
      onOpenChange(false);
      setEmail("");
      setRole("");
      setDepartmentId("");
    } catch (error) {
      console.error('Error inviting employee:', error);
      toast.error("Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Invite New Employee
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="employee@company.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIEWER">Viewer</SelectItem>
                <SelectItem value="OPS">Operations</SelectItem>
                <SelectItem value="SUPPORT">Support</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={departmentId} onValueChange={setDepartmentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select department (optional)" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Send Invitation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};