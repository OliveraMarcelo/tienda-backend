variable "ubuntu_image_url" {
  description = "URL de la imagen cloud Ubuntu 22.04 (QCOW2)"
  type        = string
  default     = "https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img"
}

variable "ssh_public_key_path" {
  description = "Path a la clave pública SSH del host para acceder a las VMs"
  type        = string
  default     = "~/.ssh/id_ed25519.pub"
}

variable "disk_size_bytes" {
  description = "Tamaño del disco de cada VM en bytes (default: 20 GB)"
  type        = number
  default     = 21474836480 # 20 GB
}

# ─── dev VM ──────────────────────────────────────────────────────────────────

variable "dev_ram_mb" {
  description = "RAM para la VM dev en MB"
  type        = number
  default     = 2048
}

variable "dev_vcpu" {
  description = "vCPUs para la VM dev"
  type        = number
  default     = 2
}

# ─── stg VM ──────────────────────────────────────────────────────────────────

variable "stg_ram_mb" {
  description = "RAM para la VM stg en MB"
  type        = number
  default     = 2048
}

variable "stg_vcpu" {
  description = "vCPUs para la VM stg"
  type        = number
  default     = 2
}
