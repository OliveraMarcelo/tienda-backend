#cloud-config

hostname: ${hostname}
manage_etc_hosts: true

users:
  - name: jedami
    groups: [sudo, docker]
    shell: /bin/bash
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_authorized_keys:
      - ${ssh_pubkey}

package_update: true
package_upgrade: false

packages:
  - curl
  - wget
  - ca-certificates
  - gnupg
  - lsb-release

runcmd:
  # Instalar Docker
  - install -m 0755 -d /etc/apt/keyrings
  - curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  - chmod a+r /etc/apt/keyrings/docker.asc
  - echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
  - apt-get update -qq
  - apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  - systemctl enable --now docker
  # Directorio de trabajo
  - mkdir -p /opt/jedami
  - chown jedami:jedami /opt/jedami

final_message: "jedami VM ${hostname} lista en $UPTIME segundos"
