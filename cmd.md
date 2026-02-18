## killed port 3000
- in win:
  -------
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force

- in linux:
  ---------
  fuser -k 3000/tcp