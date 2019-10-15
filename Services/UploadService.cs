using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.AspNetCore.Http;

namespace Artefactor.Services
{
    public class UploadService
    {
        private string _accessKey = "";
        private string _defaultContainerName = "";

        public UploadService(IConfiguration configuration)
        {
            this._accessKey = configuration["BlobStorage:AccessKey"];
            this._defaultContainerName =
                configuration["BlobStorage:ProfileImagesContainer"];
        }

        // Returns Uri of uploaded param. 'file'. If successful, Uri will be
        //  'GenerateFileName(fileName)'. Otherwise, returns null.
        public async Task<Uri> UploadFileToBlobAsync(
            string fileName, 
            IFormFile file)  
        {  
            // byte[] fileData, string fileMimeType
            try  
            {  
                // TODO: use artefact container
                var blobContainer = GetBlobContainer(this._accessKey, 
                                            this._defaultContainerName);

                var uniqueFileName = this.GenerateFileName(fileName);

                if (await blobContainer.CreateIfNotExistsAsync())
                {
                    await blobContainer.SetPermissionsAsync(
                        new BlobContainerPermissions
                        {
                            PublicAccess = BlobContainerPublicAccessType.Blob
                        });
                }

                if (uniqueFileName != null && file != null)
                {
                    CloudBlockBlob blockBlob =
                        blobContainer.GetBlockBlobReference(uniqueFileName);

                    await blockBlob.UploadFromStreamAsync(file.OpenReadStream());

                    return blockBlob.Uri;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
        }

        public async void DeleteBlobData(string fileUrl)
        {
            Uri uriObj = new Uri(fileUrl);
            string BlobName = Path.GetFileName(uriObj.LocalPath);

            CloudBlobContainer cloudBlobContainer =
                GetBlobContainer(_accessKey, _defaultContainerName);

            string pathPrefix = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd") + "/";
            CloudBlobDirectory blobDirectory = cloudBlobContainer.GetDirectoryReference(pathPrefix);
            // get block blob
            CloudBlockBlob blockBlob = blobDirectory.GetBlockBlobReference(BlobName);

            // delete blob from container
            await blockBlob.DeleteAsync();
        }

        private CloudBlobContainer GetBlobContainer(string connectionString, string containerName)
        {
            var storageAccount = CloudStorageAccount.Parse(connectionString);
            var blobClient = storageAccount.CreateCloudBlobClient();
            return blobClient.GetContainerReference(containerName);
        }

        private string GenerateFileName(string fileName)
        {
            string strFileName = string.Empty;
            string[] strName = fileName.Split('.');
            strFileName = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd") + "/" + DateTime.Now.ToUniversalTime().ToString("yyyyMMdd\\THHmmssfff") + "." + strName[strName.Length - 1];
            return strFileName;
        }

    }
}
