import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Users, Search, Edit, Eye, Shield, RefreshCw, XCircle, ChevronLeft, ChevronRight, Plus, Filter, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import AdminLayout from "@/components/AdminLayout";
import UsuariosView from '@/features/control/usuarios/usuariosView';

interface AddUserFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles: string[];
}

const UsuariosPage = () => {
  return <UsuariosView />;
};

export default UsuariosPage;