output "dev_ip" {
  description = "IP de la VM dev"
  value       = libvirt_domain.dev.network_interface[0].addresses[0]
}

output "stg_ip" {
  description = "IP de la VM stg"
  value       = libvirt_domain.stg.network_interface[0].addresses[0]
}

output "dev_ssh" {
  description = "Comando SSH para conectarse a dev"
  value       = "ssh jedami@${libvirt_domain.dev.network_interface[0].addresses[0]}"
}

output "stg_ssh" {
  description = "Comando SSH para conectarse a stg"
  value       = "ssh jedami@${libvirt_domain.stg.network_interface[0].addresses[0]}"
}
