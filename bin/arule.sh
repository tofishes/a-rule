#!/bin/bash
aruleHelp()
{
  cat <<- EOF
  Usage: arule [options]

  Options:
    -h, --help  display help for command
     Usage:
     $ arule init 初始化项目目录
     $ arule dev 测试环境编译
     $ arule prod 生产环境编译
EOF
}

# 参数不为空，参数为指定环境
if [ -n "$1" ] ; then
  case $1 in
    init)
      gulp init;;
    dev)
      gulp dev;;
    prod)
      gulp prod;;
    -h|--help)
      aruleHelp;;
  esac
else
  aruleHelp
fi
