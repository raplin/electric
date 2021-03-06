# The Manual (Hard(er)) Way

Read these instructions all the way through - to the bottom of the file BEFORE beginning - there is useful info everywhere.  

*I don't recommend this unless you want to experience EVERY single step of the setup.*  

### Privs for device access
Remember to do the following, so that a user-space program can access the iCharger:
 
    echo 'SUBSYSTEMS=="usb", ATTRS{idVendor}=="0483", ATTRS{idProduct}=="5751", MODE:="0666"' > /etc/udev/rules.d/10-icharger.rules

## Install Hypriot

1. https://github.com/hypriot/flash

1. get the system updated (this isn't optional btw)


    $ sudo apt-get update 
    $ sudo apt-get upgrade
    $ sudo apt-get install gcc python-dev g++
    
4. pull down + install pip


    $ wget https://bootstrap.pypa.io/get-pip.py
    $ sudo python get-pip.py
    $ sudo pip install virtualenv virtualenvwrapper
    
5. adjust your terminal to run virtualenvwrapper on login


    $ echo 'source /usr/local/bin/virtualenvwrapper.sh' >> ~/.bashrc 
    
6. logout / log back in (so the shell gets the new virtualenvwrapper stuff)

7. make up a new virtual environment for python


    $ mkvirtualenv electric
    
8. auto cd into the electric folder when running 'workon electric'


    $ echo 'cd ~/electric/src/server' >> ~/.virtualenvs/electric/bin/postactivate

9. Get the code: 


    $ git clone https://github.com/johncclayton/electric.git

10. If you are setting up PyCharm, remember to use 'workon electric' to get the right python path.

    1. The 'run configuration' will need a source mapping from your dev system to the remote destination 
   path, for example on my Windows machine this is from d:\src\electric => /home/pirate/electric 
    1. In the case above I used hypriot, so double-check the Raspberry Pi path when setting up the Remote Python Interpreter
   and Deployment and Run Configurations.
   
11. Then do the dependency installs - very important to get libusb-dev :


    $ sudo apt-get update
    $ **hypriot**: sudo apt-get install libudev-dev libusb-1.0-0-dev gcc cython cython-dbg
    $ **noobs**: sudo apt-get install libudev-dev libusb-1.0-0.dev gcc cython cython-dev
   
12. the pull in the required python modules
    1. workon electric
    1. pip install hidapi (**NOTE: hidapi takes about 30 minutes to compile + install**. Make sure you have libusb-dev installed first, this is normally taken care of above, step 11)
    1. pip install -r requirements-worker.txt
    1. pip install -r requirements-web.txt
