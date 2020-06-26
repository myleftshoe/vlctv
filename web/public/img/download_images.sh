# This script is used to download images given a list of urls

imgdir=$1
urllist=$2

mkdir $imgdir
while read p;
do
    wget $p -P $imgdir
done < $urllist
echo "Finish downloading"

# deduplicate the urls and remove the headers in the file
# use the command `nohup bash download_images.sh img/ urllist.txt &> download.log &` to run it on the background