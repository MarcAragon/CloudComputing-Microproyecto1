# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  if Vagrant.has_plugin? "vagrant-vbguest"
    config.vbguest.no_install = true
    config.vbguest.auto_update = false
    config.vbguest.no_remote = true
  end

  config.vm.define :clienteUbuntu do |clienteUbuntu|
    clienteUbuntu.vm.box = "bento/ubuntu-22.04"
    clienteUbuntu.vm.network :private_network, ip: "192.168.56.2" #No eran validas
    clienteUbuntu.vm.hostname = "clienteUbuntu"
  end

  config.vm.define :servidorUbuntu do |servidorUbuntu|
    servidorUbuntu.vm.box = "bento/ubuntu-22.04"
    servidorUbuntu.vm.network :private_network, ip: "192.168.56.3"
    servidorUbuntu.vm.provision "shell", inline: <<-SHELL

      #apt update && apt upgrade #Solo la primera vez que se ejecuta el script
      #apt install haproxy
      apt-get install -y dos2unix haproxy

      cp /home/vagrant/SyncedFolder/Haproxyconfig.cfg /etc/haproxy/haproxy.cfg
      cp /home/vagrant/SyncedFolder/503-sorry.http /etc/haproxy/errors/503-sorry.http

      dos2unix /etc/haproxy/haproxy.cfg /etc/haproxy/errors/503-sorry.http #FORMATEA EL ARCHIVO PARA EVITAR ERRORES
      sed -i -e '$a\\' /etc/haproxy/haproxy.cfg /etc/haproxy/errors/503-sorry.http

      systemctl enable haproxy
      systemctl restart haproxy


      consul agent -ui -dev -bind=192.168.56.3 -client=0.0.0.0 -data-dir=/tmp/consul > /dev/null 2>&1 & #Cluster consul
    SHELL

  end

    config.vm.define :servidorUbuntu2 do |servidorUbuntu2|
    servidorUbuntu2.vm.box = "bento/ubuntu-22.04"
    servidorUbuntu2.vm.network :private_network, ip: "192.168.56.4"
    servidorUbuntu2.vm.hostname = "servidorUbuntu2"
    servidorUbuntu2.vm.provision "shell", inline: <<-SHELL

    #apt-get update
    #apt-get remove -y --purge nodejs npm libnode-dev libnode72 nodejs-doc || true
    #apt-get autoremove -y

    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs

    nohup node /home/vagrant/SyncedFolder/server.js 8080 > /tmp/node.log 2>&1 & #App
    disown

    nohup node /home/vagrant/SyncedFolder/server.js 8081 > /tmp/node.log 2>&1 & #App
    disown
    SHELL
  end

    config.vm.define :servidorUbuntu3 do |servidorUbuntu3|
    servidorUbuntu3.vm.box = "bento/ubuntu-22.04"
    servidorUbuntu3.vm.network :private_network, ip: "192.168.56.5"
    servidorUbuntu3.vm.hostname = "servidorUbuntu3"
    servidorUbuntu3.vm.provision "shell", inline: <<-SHELL

    #apt-get update
    #apt-get remove -y --purge nodejs npm libnode-dev libnode72 nodejs-doc || true
    #apt-get autoremove -y

    #curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    #apt-get install -y nodejs

    nohup node /home/vagrant/SyncedFolder/server.js 8081 > /tmp/node.log 2>&1 & #App 2
    disown

    nohup node /home/vagrant/SyncedFolder/server.js 8080 > /tmp/node.log 2>&1 & #App 2
    disown
    SHELL
  end


  config.vm.synced_folder "./SyncedFolder", "/home/vagrant/SyncedFolder"
end