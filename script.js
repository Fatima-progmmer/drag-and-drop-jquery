$(document).ready(function () {
    // Initialize upload area
    var uploadArea = $('.upload-area');
    var fileInput = $('#fileInput');
    var uploadedFiles = $('.uploaded-files');

    // Open file dialog on click
    uploadArea.on('click', function () {
        fileInput.trigger('click');
    });

    // Handle file input change
    fileInput.on('change', function () {
        var files = this.files;
        uploadFiles(files);
    });

    // Handle drag and drop
    uploadArea.on('dragover', function (e) {
        e.preventDefault();
        $(this).addClass('drag-over');
    });

    uploadArea.on('dragleave', function () {
        $(this).removeClass('drag-over');
    });

    uploadArea.on('drop', function (e) {
        e.preventDefault();
        var files = e.originalEvent.dataTransfer.files;
        uploadFiles(files);
        $(this).removeClass('drag-over');
    });

    // Upload files function
    function uploadFiles(files) {
        $.each(files, function (index, file) {
            var fileName = file.name;
            var fileSize = file.size;
            var fileType = file.type;

            // Validate file type
            if (!fileType.match('image.*')) {
                uploadedFiles.append('<li><span class="file-name">' + fileName + '</span> <span class="file-size">' + humanFileSize(fileSize) + '</span> <span class="upload-error">Invalid file type</span></li>');
                return;
            }

            // Upload file using AJAX
            var formData = new FormData();
            formData.append('file', file);

            $.ajax({
                url: 'upload.php',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    uploadedFiles.append('<li><span class="file-name">' + fileName + '</span> <span class="file-size">' + humanFileSize(fileSize) + '</span> <span class="upload-success">Uploaded successfully</span></li>');
                },
                error: function (xhr, status, error) {
                    uploadedFiles.append('<li><span class="file-name">' + fileName + '</span> <span class="file-size">' + humanFileSize(fileSize) + '</span> <span class="upload-error">' + error + '</span></li>');
                }
            });
        });
    }

    // Human-readable file size function
    function humanFileSize(size) {
        var units = ['B', 'KB', 'MB', 'GB', 'TB'];
        var index = 0;
        while (size >= 1024 && index < units.length - 1) {
            size /= 1024;
            index++;
        }
        return size.toFixed(2) + ' ' + units[index];
    }
});